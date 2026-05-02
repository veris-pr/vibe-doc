import json
import re
from typing import Optional, Any
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class OpenAPISpec:
    title: str
    version: str
    description: str
    base_url: str
    endpoints: list = field(default_factory=list)
    schemas: dict = field(default_factory=dict)
    security_schemes: dict = field(default_factory=dict)


@dataclass
class Endpoint:
    path: str
    method: str
    summary: str
    description: str
    operation_id: str
    tags: list
    parameters: list
    request_body: Optional[dict] = None
    responses: list = field(default_factory=list)
    security: list = field(default_factory=list)


@dataclass
class Parameter:
    name: str
    location: str
    required: bool
    description: str
    schema: dict


@dataclass
class Response:
    status_code: str
    description: str
    schema: Optional[dict] = None
    examples: list = field(default_factory=list)


class OpenAPIParser:
    METHOD_COLORS = {
        'get': '#10b981',
        'post': '#6366f1',
        'put': '#f59e0b',
        'patch': '#f59e0b',
        'delete': '#ef4444',
    }

    def __init__(self, spec_data: dict):
        self.spec = spec_data
        self.base_url = self._get_base_url()

    def _get_base_url(self) -> str:
        servers = self.spec.get('servers', [])
        if servers and 'url' in servers[0]:
            return servers[0]['url']
        
        schemes = self.spec.get('schemes', ['https'])
        host = self.spec.get('host', 'api.example.com')
        base_path = self.spec.get('basePath', '')
        
        scheme = schemes[0] if schemes else 'https'
        return f"{scheme}://{host}{base_path}"

    def parse(self) -> OpenAPISpec:
        info = self.spec.get('info', {})
        
        endpoints = []
        paths = self.spec.get('paths', {})
        
        for path, methods in paths.items():
            for method, details in methods.items():
                if method not in ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']:
                    continue
                
                endpoint = self._parse_endpoint(path, method, details)
                endpoints.append(endpoint)
        
        schemas = self.spec.get('components', {}).get('schemas', {})
        
        security_schemes = self.spec.get('components', {}).get('securitySchemes', {})
        
        return OpenAPISpec(
            title=info.get('title', 'API'),
            version=info.get('version', '1.0.0'),
            description=info.get('description', ''),
            base_url=self.base_url,
            endpoints=endpoints,
            schemas=schemas,
            security_schemes=security_schemes
        )

    def _parse_endpoint(self, path: str, method: str, details: dict) -> Endpoint:
        parameters = []
        
        params = details.get('parameters', [])
        for param in params:
            parameters.append(Parameter(
                name=param.get('name', ''),
                location=param.get('in', 'query'),
                required=param.get('required', False),
                description=param.get('description', ''),
                schema=param.get('schema', {})
            ))
        
        path_params = details.get('parameters', [])
        for p in path_params:
            if p.get('in') == 'path':
                path = path.replace(f"{{{p.get('name')}}}", f":{p.get('name')}")
        
        responses = []
        for code, resp in details.get('responses', {}).items():
            responses.append(Response(
                status_code=code,
                description=resp.get('description', ''),
                schema=resp.get('content', {}).get('application/json', {}).get('schema'),
                examples=resp.get('content', {}).get('application/json', {}).get('examples', [])
            ))
        
        request_body = None
        if 'requestBody' in details:
            rb = details['requestBody']
            content = rb.get('content', {})
            request_body = {
                'required': rb.get('required', False),
                'description': rb.get('description', ''),
                'content': content
            }
        
        return Endpoint(
            path=path,
            method=method.upper(),
            summary=details.get('summary', ''),
            description=details.get('description', ''),
            operation_id=details.get('operationId', ''),
            tags=details.get('tags', []),
            parameters=parameters,
            request_body=request_body,
            responses=responses,
            security=details.get('security', [])
        )

    def get_method_color(self, method: str) -> str:
        return self.METHOD_COLORS.get(method.lower(), '#6b7280')


def parse_openapi(spec_data: dict) -> OpenAPISpec:
    parser = OpenAPIParser(spec_data)
    return parser.parse()


def parse_openapi_file(file_path: str) -> OpenAPISpec:
    with open(file_path, 'r', encoding='utf-8') as f:
        spec_data = json.load(f)
    return parse_openapi(spec_data)


def generate_schema_example(schema: dict, depth: int = 0) -> dict:
    if depth > 3:
        return {"...": "nested"}
    
    if '$ref' in schema:
        ref = schema['$ref'].split('/')[-1]
        return {ref: "..."}
    
    if schema.get('type') == 'object' and 'properties' in schema:
        return {
            key: generate_schema_example(prop, depth + 1)
            for key, prop in schema['properties'].items()
        }
    
    if schema.get('type') == 'array' and 'items' in schema:
        return [generate_schema_example(schema['items'], depth + 1)]
    
    if schema.get('type') == 'string':
        if schema.get('format') == 'date-time':
            return "2024-01-01T00:00:00Z"
        if schema.get('format') == 'date':
            return "2024-01-01"
        if schema.get('format') == 'email':
            return "user@example.com"
        if schema.get('format') == 'uuid':
            return "550e8400-e29b-41d4-a716-446655440000"
        return "string"
    
    if schema.get('type') == 'integer':
        return 0
    
    if schema.get('type') == 'number':
        return 0.0
    
    if schema.get('type') == 'boolean':
        return True
    
    if 'enum' in schema:
        return schema['enum'][0]
    
    return None


def generate_code_samples(endpoint: Endpoint, base_url: str) -> list[dict]:
    samples = []
    
    langs = [
        ('curl', 'cURL'),
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('go', 'Go'),
        ('ruby', 'Ruby')
    ]
    
    url = f"{base_url}{endpoint.path}"
    
    for lang, lang_name in langs:
        if lang == 'curl':
            cmd = f"curl -X {endpoint.method} '{url}'"
            if endpoint.security:
                cmd += " \\\n  -H 'Authorization: Bearer YOUR_TOKEN'"
            
            for param in endpoint.parameters:
                if param.location == 'header':
                    cmd += f" \\\n  -H '{param.name}: value'"
                elif param.location == 'query':
                    cmd += f" \\\n  -g '{param.name}=value'"
            
            if endpoint.request_body:
                cmd += " \\\n  -H 'Content-Type: application/json'"
                cmd += " \\\n  -d '{\"...\"}'"
            
            samples.append({'language': lang_name, 'code': cmd})
        
        elif lang == 'python':
            code = f"import requests\n\n"
            code += f"response = requests.{endpoint.method.lower()}('{url}'"
            
            if endpoint.parameters or endpoint.request_body:
                code += ",\n    params={\n"
                for param in endpoint.parameters:
                    if param.location == 'query':
                        code += f"        '{param.name}': '{param.name.lower()}',\n"
                code += "    }"
                
                if endpoint.request_body:
                    code += ",\n    json={\n        ...\n    }"
            
            code += ")"
            samples.append({'language': lang_name, 'code': code})
        
        elif lang == 'javascript':
            code = f"fetch('{url}', {{\n"
            code += f"    method: '{endpoint.method}',\n"
            code += "    headers: {\n"
            code += "        'Content-Type': 'application/json'\n"
            code += "    },\n"
            
            if endpoint.request_body:
                code += "    body: JSON.stringify({...})\n"
            
            code += "})"
            samples.append({'language': lang_name, 'code': code})
        
        elif lang == 'go':
            code = f"req, _ := http.NewRequest(\"{endpoint.method}\", \"{url}\", nil)\n"
            code += "req.Header.Set(\"Content-Type\", \"application/json\")\n"
            code += "client := &http.Client{}\n"
            code += "resp, _ := client.Do(req)"
            samples.append({'language': lang_name, 'code': code})
        
        elif lang == 'ruby':
            code = f"require 'net/http'\n\n"
            code += f"uri = URI('{url}')\n"
            code += "http = Net::HTTP.new(uri.host, uri.port)\n"
            code += f"request = Net::HTTP::{endpoint.method.capitalize()}.new(uri)\n"
            code += "request['Content-Type'] = 'application/json'\n"
            code += "response = http.request(request)"
            samples.append({'language': lang_name, 'code': code})
    
    return samples


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        spec = parse_openapi_file(sys.argv[1])
        print(f"Parsed {spec.title} v{spec.version}")
        print(f"Base URL: {spec.base_url}")
        print(f"Endpoints: {len(spec.endpoints)}")