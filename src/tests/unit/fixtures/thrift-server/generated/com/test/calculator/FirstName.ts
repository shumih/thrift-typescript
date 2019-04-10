/* tslint:disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v{{VERSION}}
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "test-lib";
export interface IFirstName {
    name?: string;
}
export interface IFirstNameArgs {
    name?: string;
}
export const FirstNameCodec: thrift.IStructCodec<IFirstNameArgs, IFirstName> = {
    encode(args: IFirstNameArgs, output: thrift.TProtocol): void {
        const obj = {
            name: args.name
        };
        output.writeStructBegin("FirstName");
        if (obj.name != null) {
            output.writeFieldBegin("name", thrift.TType.STRING, 1);
            output.writeString(obj.name);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IFirstName {
        let _args: any = {};
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                case 1:
                    if (fieldType === thrift.TType.STRING) {
                        const value_1: string = input.readString();
                        _args.name = value_1;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return {
            name: _args.name
        };
    }
};
export class FirstName extends thrift.StructLike implements IFirstName {
    public name?: string;
    public readonly _annotations: thrift.IThriftAnnotations = {};
    public readonly _fieldAnnotations: thrift.IFieldAnnotations = {};
    constructor(args: IFirstNameArgs = {}) {
        super();
        if (args.name != null) {
            const value_2: string = args.name;
            this.name = value_2;
        }
    }
    public static read(input: thrift.TProtocol): FirstName {
        return new FirstName(FirstNameCodec.decode(input));
    }
    public static write(args: IFirstNameArgs, output: thrift.TProtocol): void {
        return FirstNameCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return FirstNameCodec.encode(this, output);
    }
}
