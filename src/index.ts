import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
let thriftParser = require('thrift-parser')
import { compile } from 'handlebars'
import { registerHelpers } from './ts-helpers'

function readFile(fileName: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function getStructs(idl: any) {
  const keys = idl.struct || []
  return Object.keys(keys).map(key => ({
    fields: idl.struct[key],
    name: key,
  }))
}

async function generateTypes(types: any) {
  const template: HandlebarsTemplateDelegate = await loadTemplate('types.hbs')
  return template(types)
}

function getServices(idl: any) {
  return Object.keys(idl.service).map(key => ({
    methods: idl.service[key],
    name: key,
  }))
}

async function generateServices(services: any) {
  const template: HandlebarsTemplateDelegate = await loadTemplate('services.hbs')
  return template(services)
}

export async function loadTemplate(fileName: string): Promise<HandlebarsTemplateDelegate> {
  const fullPath = path.join(__dirname, `../templates/${fileName}`)
  const src = await readFile(fullPath)
  return compile(src)
}

export function parseFile(fileName: string): Promise<any> {
  return readFile(fileName).then(idl => {
    return thriftParser(idl)
  })
}

export async function generateIDLTypes(fileName: string): Promise<string> {
  registerHelpers()
  const idl = await parseFile(fileName)
  const structs = getStructs(idl)
  return generateTypes(structs)
}

export async function generateIDLServices(fileName: string): Promise<string> {
  registerHelpers()
  const idl = await parseFile(fileName)
  let upcaseFile = path.basename(fileName).split('.thrift')[0]
  upcaseFile = upcaseFile[0].toUpperCase() + upcaseFile.substr(1)
  const input = {
    fileName: upcaseFile,
    services: getServices(idl),
    structs: getStructs(idl),
  }
  return generateServices(input)
}

function generateServicesAST(services: any[]): string {
  // TODO: bundle maybe?
  let src = ts.createSourceFile('output.ts', '', ts.ScriptTarget.ES5, false, ts.ScriptKind.TS);
  // TODO: imports?

  services.forEach(function(service) {
    const _exportModifier = ts.createToken(ts.SyntaxKind.ExportKeyword);
    const _publicModifier = ts.createToken(ts.SyntaxKind.PublicKeyword);
    const _numberKeyword = ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    const _stringKeyword = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    const _booleanKeyword = ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);

    const _fieldDeclarations = service.fields.map(function(field) {

      let _optional;
      // TODO: doesn't seem to be working
      switch(field.option) {
        case 'optional':
          _optional = ts.createToken(ts.SyntaxKind.QuestionToken);
          break;
      }

      let _type;
      switch(field.type) {
        case 'int':
        case 'i16':
        case 'i32':
          _type = _numberKeyword;
          break;
        case 'string':
          _type = _stringKeyword;
          break;
        case 'bool':
          _type = _booleanKeyword;
          break;
      }

      let _default;
      if (field.defaultValue != null) {
        _default = ts.createLiteral(field.defaultValue);
      }

      return ts.createProperty(undefined, [_publicModifier], field.name, _optional, _type, _default);
    });

    const _successDeclaration = ts.createProperty(undefined, [_publicModifier], 'success', undefined, _booleanKeyword, undefined);

    const _propertyDeclarations = [_successDeclaration].concat(_fieldDeclarations);

    const _classExpression = ts.createClassExpression([_exportModifier], service.name, [], [], _propertyDeclarations);

    const _classStatement = ts.createStatement(_classExpression);

    src = ts.updateSourceFileNode(src, [_classStatement]);
  });


  const printer = ts.createPrinter();

  return printer.printFile(src);
}

export async function generateIDLTypesAST(filename: string): Promise<string> {
  registerHelpers();
  const idl = await parseFile(filename);
  const structs = getStructs(idl);
  const out = generateServicesAST(structs);

  console.log(out);

  return generateTypes(structs);
}
