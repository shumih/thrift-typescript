export namespace ParentService {
    export interface IPingArgs {
        status: number;
    }
    export interface IPingArgs_Loose {
        status: number;
    }
    export const PingArgsCodec: thrift.IStructCodec<IPingArgs_Loose, IPingArgs> = {
        encode(args: IPingArgs_Loose, output: thrift.TProtocol): void {
            const obj = {
                status: args.status
            };
            output.writeStructBegin("PingArgs");
            if (obj.status != null) {
                output.writeFieldBegin("status", thrift.TType.I32, 1);
                output.writeI32(obj.status);
                output.writeFieldEnd();
            }
            else {
                throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[status] is unset!");
            }
            output.writeFieldStop();
            output.writeStructEnd();
            return;
        },
        decode(input: thrift.TProtocol): IPingArgs {
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
                            _args.status = value_1;
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
            if (_args.status !== undefined) {
                return {
                    status: _args.status
                };
            }
            else {
                throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Unable to read PingArgs from input");
            }
        }
    };
    export class PingArgs extends thrift.StructLike  implements IPingArgs_Loose {
        public status: number;
        constructor(args: IPingArgs_Loose) {
            super();
            if (args.status != null) {
                this.status = args.status;
            }
            else {
                throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[status] is unset!");
            }
        }
        public static read(input: thrift.TProtocol): PingArgs {
            return new PingArgs(PingArgsCodec.decode(input));
        }
        public write(output: thrift.TProtocol): void {
            return PingArgsCodec.encode(this, output);
        }
    }
    export interface IPingResult {
        success?: string;
    }
    export interface IPingResult_Loose {
        success?: string;
    }
    export const PingResultCodec: thrift.IStructCodec<IPingResult_Loose, IPingResult> = {
        encode(args: IPingResult_Loose, output: thrift.TProtocol): void {
            const obj = {
                success: args.success
            };
            output.writeStructBegin("PingResult");
            if (obj.success != null) {
                output.writeFieldBegin("success", thrift.TType.STRING, 0);
                output.writeString(obj.success);
                output.writeFieldEnd();
            }
            output.writeFieldStop();
            output.writeStructEnd();
            return;
        },
        decode(input: thrift.TProtocol): IPingResult {
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
                    case 0:
                        if (fieldType === thrift.TType.STRING) {
                            const value_2: string = input.readString();
                            _args.success = value_2;
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
                success: _args.success
            };
        }
    };
    export class PingResult extends thrift.StructLike  implements IPingResult_Loose {
        public success?: string;
        constructor(args: IPingResult_Loose = {}) {
            super();
            if (args.success != null) {
                this.success = args.success;
            }
        }
        public static read(input: thrift.TProtocol): PingResult {
            return new PingResult(PingResultCodec.decode(input));
        }
        public write(output: thrift.TProtocol): void {
            return PingResultCodec.encode(this, output);
        }
    }
    export class Client<Context = any> {
        protected _requestId: number;
        protected transport: thrift.ITransportConstructor;
        protected protocol: thrift.IProtocolConstructor;
        protected connection: thrift.IThriftConnection<Context>;
        constructor(connection: thrift.IThriftConnection<Context>) {
            this._requestId = 0;
            this.transport = connection.Transport;
            this.protocol = connection.Protocol;
            this.connection = connection;
        }
        protected incrementRequestId(): number {
            return this._requestId += 1;
        }
        public ping(status: number, context?: Context): Promise<string> {
            const writer: thrift.TTransport = new this.transport();
            const output: thrift.TProtocol = new this.protocol(writer);
            output.writeMessageBegin("ping", thrift.MessageType.CALL, this.incrementRequestId());
            const args: IPingArgs_Loose = { status };
            PingArgsCodec.encode(args, output);
            output.writeMessageEnd();
            return this.connection.send(writer.flush(), context).then((data: Buffer) => {
                const reader: thrift.TTransport = this.transport.receiver(data);
                const input: thrift.TProtocol = new this.protocol(reader);
                try {
                    const { fieldName: fieldName, messageType: messageType }: thrift.IThriftMessage = input.readMessageBegin();
                    if (fieldName === "ping") {
                        if (messageType === thrift.MessageType.EXCEPTION) {
                            const err: thrift.TApplicationException = thrift.TApplicationExceptionCodec.decode(input);
                            input.readMessageEnd();
                            return Promise.reject(err);
                        }
                        const result: IPingResult = PingResultCodec.decode(input);
                        input.readMessageEnd();
                        if (result.success != null) {
                            return Promise.resolve(result.success);
                        }
                        else {
                            return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, "ping failed: unknown result"));
                        }
                    }
                    else {
                        return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.WRONG_METHOD_NAME, "Received a response to an unknown RPC function: " + fieldName));
                    }
                }
                catch (err) {
                    return Promise.reject(err);
                }
            });
        }
    }
    export interface IHandler<Context = any> {
        ping(status: number, context?: Context): string | Promise<string>;
    }
    export class Processor<Context = any> {
        public _handler: IHandler<Context>;
        constructor(handler: IHandler<Context>) {
            this._handler = handler;
        }
        public process(input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
            return new Promise<Buffer>((resolve, reject): void => {
                const metadata: thrift.IThriftMessage = input.readMessageBegin();
                const fieldName: string = metadata.fieldName;
                const requestId: number = metadata.requestId;
                const methodName: string = "process_" + fieldName;
                switch (methodName) {
                    case "process_ping": {
                        resolve(this.process_ping(requestId, input, output, context));
                    }
                    default: {
                        input.skip(thrift.TType.STRUCT);
                        input.readMessageEnd();
                        const errMessage = "Unknown function " + fieldName;
                        const err = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN_METHOD, errMessage);
                        output.writeMessageBegin(fieldName, thrift.MessageType.EXCEPTION, requestId);
                        thrift.TApplicationExceptionCodec.encode(err, output);
                        output.writeMessageEnd();
                        resolve(output.flush());
                    }
                }
            });
        }
        public process_ping(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
            return new Promise<string>((resolve, reject): void => {
                try {
                    const args: IPingArgs = PingArgsCodec.decode(input);
                    input.readMessageEnd();
                    resolve(this._handler.ping(args.status, context));
                }
                catch (err) {
                    reject(err);
                }
            }).then((data: string): Buffer => {
                const result: IPingResult = { success: data };
                output.writeMessageBegin("ping", thrift.MessageType.REPLY, requestId);
                PingResultCodec.encode(result, output);
                output.writeMessageEnd();
                return output.flush();
            }).catch((err: Error): Buffer => {
                const result: thrift.TApplicationException = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, err.message);
                output.writeMessageBegin("ping", thrift.MessageType.EXCEPTION, requestId);
                thrift.TApplicationExceptionCodec.encode(result, output);
                output.writeMessageEnd();
                return output.flush();
            });
        }
    }
}
export namespace ChildService {
    export interface IPegArgs {
        name: string;
    }
    export interface IPegArgs_Loose {
        name: string;
    }
    export const PegArgsCodec: thrift.IStructCodec<IPegArgs_Loose, IPegArgs> = {
        encode(args: IPegArgs_Loose, output: thrift.TProtocol): void {
            const obj = {
                name: args.name
            };
            output.writeStructBegin("PegArgs");
            if (obj.name != null) {
                output.writeFieldBegin("name", thrift.TType.STRING, 1);
                output.writeString(obj.name);
                output.writeFieldEnd();
            }
            else {
                throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[name] is unset!");
            }
            output.writeFieldStop();
            output.writeStructEnd();
            return;
        },
        decode(input: thrift.TProtocol): IPegArgs {
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
                            const value_3: string = input.readString();
                            _args.name = value_3;
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
            if (_args.name !== undefined) {
                return {
                    name: _args.name
                };
            }
            else {
                throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Unable to read PegArgs from input");
            }
        }
    };
    export class PegArgs extends thrift.StructLike  implements IPegArgs_Loose {
        public name: string;
        constructor(args: IPegArgs_Loose) {
            super();
            if (args.name != null) {
                this.name = args.name;
            }
            else {
                throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[name] is unset!");
            }
        }
        public static read(input: thrift.TProtocol): PegArgs {
            return new PegArgs(PegArgsCodec.decode(input));
        }
        public write(output: thrift.TProtocol): void {
            return PegArgsCodec.encode(this, output);
        }
    }
    export interface IPongArgs {
        name?: string;
    }
    export interface IPongArgs_Loose {
        name?: string;
    }
    export const PongArgsCodec: thrift.IStructCodec<IPongArgs_Loose, IPongArgs> = {
        encode(args: IPongArgs_Loose, output: thrift.TProtocol): void {
            const obj = {
                name: args.name
            };
            output.writeStructBegin("PongArgs");
            if (obj.name != null) {
                output.writeFieldBegin("name", thrift.TType.STRING, 1);
                output.writeString(obj.name);
                output.writeFieldEnd();
            }
            output.writeFieldStop();
            output.writeStructEnd();
            return;
        },
        decode(input: thrift.TProtocol): IPongArgs {
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
                            const value_4: string = input.readString();
                            _args.name = value_4;
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
    export class PongArgs extends thrift.StructLike  implements IPongArgs_Loose {
        public name?: string;
        constructor(args: IPongArgs_Loose = {}) {
            super();
            if (args.name != null) {
                this.name = args.name;
            }
        }
        public static read(input: thrift.TProtocol): PongArgs {
            return new PongArgs(PongArgsCodec.decode(input));
        }
        public write(output: thrift.TProtocol): void {
            return PongArgsCodec.encode(this, output);
        }
    }
    export interface IPegResult {
        success?: string;
    }
    export interface IPegResult_Loose {
        success?: string;
    }
    export const PegResultCodec: thrift.IStructCodec<IPegResult_Loose, IPegResult> = {
        encode(args: IPegResult_Loose, output: thrift.TProtocol): void {
            const obj = {
                success: args.success
            };
            output.writeStructBegin("PegResult");
            if (obj.success != null) {
                output.writeFieldBegin("success", thrift.TType.STRING, 0);
                output.writeString(obj.success);
                output.writeFieldEnd();
            }
            output.writeFieldStop();
            output.writeStructEnd();
            return;
        },
        decode(input: thrift.TProtocol): IPegResult {
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
                    case 0:
                        if (fieldType === thrift.TType.STRING) {
                            const value_5: string = input.readString();
                            _args.success = value_5;
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
                success: _args.success
            };
        }
    };
    export class PegResult extends thrift.StructLike  implements IPegResult_Loose {
        public success?: string;
        constructor(args: IPegResult_Loose = {}) {
            super();
            if (args.success != null) {
                this.success = args.success;
            }
        }
        public static read(input: thrift.TProtocol): PegResult {
            return new PegResult(PegResultCodec.decode(input));
        }
        public write(output: thrift.TProtocol): void {
            return PegResultCodec.encode(this, output);
        }
    }
    export interface IPongResult {
        success?: string;
    }
    export interface IPongResult_Loose {
        success?: string;
    }
    export const PongResultCodec: thrift.IStructCodec<IPongResult_Loose, IPongResult> = {
        encode(args: IPongResult_Loose, output: thrift.TProtocol): void {
            const obj = {
                success: args.success
            };
            output.writeStructBegin("PongResult");
            if (obj.success != null) {
                output.writeFieldBegin("success", thrift.TType.STRING, 0);
                output.writeString(obj.success);
                output.writeFieldEnd();
            }
            output.writeFieldStop();
            output.writeStructEnd();
            return;
        },
        decode(input: thrift.TProtocol): IPongResult {
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
                    case 0:
                        if (fieldType === thrift.TType.STRING) {
                            const value_6: string = input.readString();
                            _args.success = value_6;
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
                success: _args.success
            };
        }
    };
    export class PongResult extends thrift.StructLike  implements IPongResult_Loose {
        public success?: string;
        constructor(args: IPongResult_Loose = {}) {
            super();
            if (args.success != null) {
                this.success = args.success;
            }
        }
        public static read(input: thrift.TProtocol): PongResult {
            return new PongResult(PongResultCodec.decode(input));
        }
        public write(output: thrift.TProtocol): void {
            return PongResultCodec.encode(this, output);
        }
    }
    export class Client<Context = any> extends ParentService.Client<Context> {
        protected _requestId: number;
        protected transport: thrift.ITransportConstructor;
        protected protocol: thrift.IProtocolConstructor;
        protected connection: thrift.IThriftConnection<Context>;
        constructor(connection: thrift.IThriftConnection<Context>) {
            super(connection);
            this._requestId = 0;
            this.transport = connection.Transport;
            this.protocol = connection.Protocol;
            this.connection = connection;
        }
        protected incrementRequestId(): number {
            return this._requestId += 1;
        }
        public peg(name: string, context?: Context): Promise<string> {
            const writer: thrift.TTransport = new this.transport();
            const output: thrift.TProtocol = new this.protocol(writer);
            output.writeMessageBegin("peg", thrift.MessageType.CALL, this.incrementRequestId());
            const args: IPegArgs_Loose = { name };
            PegArgsCodec.encode(args, output);
            output.writeMessageEnd();
            return this.connection.send(writer.flush(), context).then((data: Buffer) => {
                const reader: thrift.TTransport = this.transport.receiver(data);
                const input: thrift.TProtocol = new this.protocol(reader);
                try {
                    const { fieldName: fieldName, messageType: messageType }: thrift.IThriftMessage = input.readMessageBegin();
                    if (fieldName === "peg") {
                        if (messageType === thrift.MessageType.EXCEPTION) {
                            const err: thrift.TApplicationException = thrift.TApplicationExceptionCodec.decode(input);
                            input.readMessageEnd();
                            return Promise.reject(err);
                        }
                        const result: IPegResult = PegResultCodec.decode(input);
                        input.readMessageEnd();
                        if (result.success != null) {
                            return Promise.resolve(result.success);
                        }
                        else {
                            return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, "peg failed: unknown result"));
                        }
                    }
                    else {
                        return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.WRONG_METHOD_NAME, "Received a response to an unknown RPC function: " + fieldName));
                    }
                }
                catch (err) {
                    return Promise.reject(err);
                }
            });
        }
        public pong(name?: string, context?: Context): Promise<string> {
            const writer: thrift.TTransport = new this.transport();
            const output: thrift.TProtocol = new this.protocol(writer);
            output.writeMessageBegin("pong", thrift.MessageType.CALL, this.incrementRequestId());
            const args: IPongArgs_Loose = { name };
            PongArgsCodec.encode(args, output);
            output.writeMessageEnd();
            return this.connection.send(writer.flush(), context).then((data: Buffer) => {
                const reader: thrift.TTransport = this.transport.receiver(data);
                const input: thrift.TProtocol = new this.protocol(reader);
                try {
                    const { fieldName: fieldName, messageType: messageType }: thrift.IThriftMessage = input.readMessageBegin();
                    if (fieldName === "pong") {
                        if (messageType === thrift.MessageType.EXCEPTION) {
                            const err: thrift.TApplicationException = thrift.TApplicationExceptionCodec.decode(input);
                            input.readMessageEnd();
                            return Promise.reject(err);
                        }
                        const result: IPongResult = PongResultCodec.decode(input);
                        input.readMessageEnd();
                        if (result.success != null) {
                            return Promise.resolve(result.success);
                        }
                        else {
                            return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, "pong failed: unknown result"));
                        }
                    }
                    else {
                        return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.WRONG_METHOD_NAME, "Received a response to an unknown RPC function: " + fieldName));
                    }
                }
                catch (err) {
                    return Promise.reject(err);
                }
            });
        }
    }
    export interface ILocalHandler<Context = any> {
        peg(name: string, context?: Context): string | Promise<string>;
        pong(name?: string, context?: Context): string | Promise<string>;
    }
    export type IHandler<Context = any> = ILocalHandler<Context> & ParentService.IHandler<Context>;
    export class Processor<Context = any> extends ParentService.Processor<Context> {
        public _handler: IHandler<Context>;
        constructor(handler: IHandler<Context>) {
            super({
                ping: handler.ping
            });
            this._handler = handler;
        }
        public process(input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
            return new Promise<Buffer>((resolve, reject): void => {
                const metadata: thrift.IThriftMessage = input.readMessageBegin();
                const fieldName: string = metadata.fieldName;
                const requestId: number = metadata.requestId;
                const methodName: string = "process_" + fieldName;
                switch (methodName) {
                    case "process_ping": {
                        resolve(this.process_ping(requestId, input, output, context));
                    }
                    case "process_peg": {
                        resolve(this.process_peg(requestId, input, output, context));
                    }
                    case "process_pong": {
                        resolve(this.process_pong(requestId, input, output, context));
                    }
                    default: {
                        input.skip(thrift.TType.STRUCT);
                        input.readMessageEnd();
                        const errMessage = "Unknown function " + fieldName;
                        const err = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN_METHOD, errMessage);
                        output.writeMessageBegin(fieldName, thrift.MessageType.EXCEPTION, requestId);
                        thrift.TApplicationExceptionCodec.encode(err, output);
                        output.writeMessageEnd();
                        resolve(output.flush());
                    }
                }
            });
        }
        public process_peg(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
            return new Promise<string>((resolve, reject): void => {
                try {
                    const args: IPegArgs = PegArgsCodec.decode(input);
                    input.readMessageEnd();
                    resolve(this._handler.peg(args.name, context));
                }
                catch (err) {
                    reject(err);
                }
            }).then((data: string): Buffer => {
                const result: IPegResult = { success: data };
                output.writeMessageBegin("peg", thrift.MessageType.REPLY, requestId);
                PegResultCodec.encode(result, output);
                output.writeMessageEnd();
                return output.flush();
            }).catch((err: Error): Buffer => {
                const result: thrift.TApplicationException = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, err.message);
                output.writeMessageBegin("peg", thrift.MessageType.EXCEPTION, requestId);
                thrift.TApplicationExceptionCodec.encode(result, output);
                output.writeMessageEnd();
                return output.flush();
            });
        }
        public process_pong(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
            return new Promise<string>((resolve, reject): void => {
                try {
                    const args: IPongArgs = PongArgsCodec.decode(input);
                    input.readMessageEnd();
                    resolve(this._handler.pong(args.name, context));
                }
                catch (err) {
                    reject(err);
                }
            }).then((data: string): Buffer => {
                const result: IPongResult = { success: data };
                output.writeMessageBegin("pong", thrift.MessageType.REPLY, requestId);
                PongResultCodec.encode(result, output);
                output.writeMessageEnd();
                return output.flush();
            }).catch((err: Error): Buffer => {
                const result: thrift.TApplicationException = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, err.message);
                output.writeMessageBegin("pong", thrift.MessageType.EXCEPTION, requestId);
                thrift.TApplicationExceptionCodec.encode(result, output);
                output.writeMessageEnd();
                return output.flush();
            });
        }
    }
}
