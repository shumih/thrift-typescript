/* tslint:disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v{{VERSION}}
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "test-lib";
import * as shared from "./../shared";
export import ICommonStruct = shared.ISharedStruct;
export import ICommonStructArgs = shared.ISharedStructArgs;
export import CommonStruct = shared.SharedStruct;
export import CommonStructCodec = shared.SharedStructCodec;
export import CommonUnionType = shared.SharedUnionType;
export import CommonUnion = shared.SharedUnion;
export import ICommonUnionWithOption1 = shared.ISharedUnionWithOption1;
export import ICommonUnionWithOption2 = shared.ISharedUnionWithOption2;
export import CommonUnionArgs = shared.SharedUnionArgs;
export import ICommonUnionWithOption1Args = shared.ISharedUnionWithOption1Args;
export import ICommonUnionWithOption2Args = shared.ISharedUnionWithOption2Args;
export import CommonUnionCodec = shared.SharedUnionCodec;
export import COMMON_INT = shared.SHARED_INT;
export interface IAuthException {
    code?: number;
    message?: string;
}
export interface IAuthExceptionArgs {
    code?: number;
    message?: string;
}
export const AuthExceptionCodec: thrift.IStructCodec<IAuthExceptionArgs, IAuthException> = {
    encode(args: IAuthExceptionArgs, output: thrift.TProtocol): void {
        const obj = {
            code: args.code,
            message: args.message
        };
        output.writeStructBegin("AuthException");
        if (obj.code != null) {
            output.writeFieldBegin("code", thrift.TType.I32, 1);
            output.writeI32(obj.code);
            output.writeFieldEnd();
        }
        if (obj.message != null) {
            output.writeFieldBegin("message", thrift.TType.STRING, 2);
            output.writeString(obj.message);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IAuthException {
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
                    if (fieldType === thrift.TType.I32) {
                        const value_1: number = input.readI32();
                        _args.code = value_1;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 2:
                    if (fieldType === thrift.TType.STRING) {
                        const value_2: string = input.readString();
                        _args.message = value_2;
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
            code: _args.code,
            message: _args.message
        };
    }
};
export class AuthException extends thrift.StructLike implements IAuthException {
    public code?: number;
    public message?: string;
    public readonly _annotations: thrift.IThriftAnnotations = {};
    public readonly _fieldAnnotations: thrift.IFieldAnnotations = {};
    constructor(args: IAuthExceptionArgs = {}) {
        super();
        if (args.code != null) {
            const value_3: number = args.code;
            this.code = value_3;
        }
        if (args.message != null) {
            const value_4: string = args.message;
            this.message = value_4;
        }
    }
    public static read(input: thrift.TProtocol): AuthException {
        return new AuthException(AuthExceptionCodec.decode(input));
    }
    public static write(args: IAuthExceptionArgs, output: thrift.TProtocol): void {
        return AuthExceptionCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return AuthExceptionCodec.encode(this, output);
    }
}
