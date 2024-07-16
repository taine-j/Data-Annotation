const REGS = {WINDOW: 100, BYTECODE_PTR: 200, BCFUNC_RETURN: 201, TRASH_REG: 202, VOID: 253, NUM_1: 254, NUM_0: 255};

const OP = {LOAD_STRING: 1, LOAD_NUM: 2, LOAD_FLOAT: 3, LOAD_LONG_NUM: 4, LOAD_ARRAY: 5, PROPACCESS: 10, FUNC_CALL: 11, EVAL: 12, CALL_BCFUNC: 13, RETURN_BCFUNC: 14, COPY: 15, EXIT: 16, COND_JUMP: 17, JUMP: 18, JUMP_COND_NEG: 19, BCFUNC_CALLBACK: 20, PROPSET: 21, TRY: 22, THROW: 23, COMP_EQUAL: 50, COMP_NOT_EQUAL: 51, COMP_STRICT_EQUAL: 52, COMP_STRICT_NOT_EQUAL: 53, COMP_LESS_THAN: 54, COMP_GREATHER_THAN: 55, COMP_LESS_THAN_EQUAL: 56, COMP_GREATHER_THAN_EQUAL: 57, ADD: 100, MUL: 101, MINUS: 102, DIV: 103};

class VM {

    constructor(){
        this.regs = [];
        this.bytecode = [];
        this.ops = [];
        this.reg_backups = [];
        this.modified_regs = [];
        this.ops[OP.LOAD_STRING] = function(vm) {
            var dst = vm.getByte(), str = vm._loadString();
            vm.setReg(dst, str);
        };
        this.ops[OP.LOAD_NUM] = function(vm) {
            var dst = vm.getByte(), val = vm.getByte();
            vm.setReg(dst, val);
        };
        this.ops[OP.LOAD_FLOAT] = function(vm) {
            var dst = vm.getByte(), val = vm._loadFloat();
            vm.setReg(dst, val);
        };
        this.ops[OP.LOAD_LONG_NUM] = function(vm) {
            var dst = vm.getByte(), val = vm._loadLongNum();
            vm.setReg(dst, val);
        };
        this.ops[OP.LOAD_ARRAY] = function(vm) {
            var dst = vm.getByte(), array = vm._loadArrayFromRegister();
            vm.setReg(dst, array);
        };
        this.ops[OP.PROPACCESS] = function(vm) {
            var dst = vm.getByte(), obj = vm.getByte(), prop = vm.getByte();
            obj = vm.getReg(obj);
            prop = vm.getReg(prop);
            vm.setReg(dst, obj[prop]);
        };
        this.ops[OP.PROPSET] = function(vm) {
            var dstObj = vm.getByte(), dstProp = vm.getByte(), val = vm.getByte();
            dstObj = vm.getReg(dstObj);
            dstProp = vm.getReg(dstProp);
            val = vm.getReg(val);
            dstObj[dstProp] = val;
        };
        this.ops[OP.TRY] = function(vm) {
            var catchBlockExceptReg = vm.getByte();
            var catchBlockOffset = vm._loadLongNum();
            var finallyBlockOffset = vm._loadLongNum();
            try {
                vm.run();
            } catch (e) {
                vm.setReg(catchBlockExceptReg, e);

                vm.runAt(catchBlockOffset);
            } finally {
                vm.runAt(finallyBlockOffset);
            }
        };
        this.ops[OP.THROW] = function(vm) {
            var reg = vm.getByte();
            throw vm.getReg(reg);
        };
        this.ops[OP.FUNC_CALL] = function(vm) {
            var dst = vm.getByte(), func = vm.getByte(), funcThis = vm.getByte(), args = vm._loadArrayFromRegister();
            func = vm.getReg(func);
            funcThis = vm.getReg(funcThis);
            vm.setReg(dst, func.apply(funcThis, args));
        };
        this.ops[OP.EVAL] = function(vm) {
            var dst = vm.getByte(), str = vm.getByte();
            str = vm.getReg(str);
            vm.setReg(dst, eval(str));
        };
        this.ops[OP.CALL_BCFUNC] = function(vm) {
            var funcOffset = vm._loadLongNum();
            var returnReg = vm.getByte();
            var argsArray = vm._loadRegistersArray();
            vm.reg_backups.push([vm.regs.slice(), returnReg]);
            for (let i = 0;i < argsArray.length;i += 2) {
                vm.setReg(argsArray[i], vm.getReg(argsArray[i + 1]));
            }
            vm.setReg(REGS.BYTECODE_PTR, funcOffset);
        };
        this.ops[OP.RETURN_BCFUNC] = function(vm) {
            var returnFromReg = vm.getByte();
            var exceptedRegs = vm._loadRegistersArray();
            var returnData = vm.reg_backups.pop();
            var regBackups = returnData[0];
            let returnToReg = returnData[1];
            vm.modified_regs = [...new Set([...vm.modified_regs, ...exceptedRegs])];
            regBackups[returnToReg] = vm.getReg(returnFromReg);
            for (let exceptedReg of vm.modified_regs) {
                regBackups[exceptedReg] = vm.getReg(exceptedReg);
            }
            if (!vm.reg_backups.length) {
                vm.modified_regs = [];
            }
            vm.regs = regBackups;
        };
        this.ops[OP.COPY] = function(vm) {
            var dst = vm.getByte(), src = vm.getByte();
            vm.setReg(dst, vm.getReg(src));
        };
        this.ops[OP.EXIT] = function(vm) {
            vm.setReg(REGS.BYTECODE_PTR, vm.bytecode.length);
        };
        this.ops[OP.COND_JUMP] = function(vm) {
            var cond = vm.getByte();
            var offset = vm._loadLongNum();
            cond = vm.getReg(cond);
            if (cond) {
                vm.setReg(REGS.BYTECODE_PTR, offset);
            }
        };
        this.ops[OP.JUMP] = function(vm) {
            var offset = vm._loadLongNum();
            vm.setReg(REGS.BYTECODE_PTR, offset);
        };
        this.ops[OP.JUMP_COND_NEG] = function(vm) {
            var cond = vm.getByte();
            var offset = vm._loadLongNum();
            cond = vm.getReg(cond);
            if (!cond) {
                vm.setReg(REGS.BYTECODE_PTR, offset);
            }
        };
        this.ops[OP.BCFUNC_CALLBACK] = function(vm) {
            var dst = vm.getByte(), func_offset = vm._loadLongNum(), arg_regs = vm._loadRegistersArray();
            vm.setReg(dst, function() {
                for (let i = 0;i < arg_regs.length;++i) {
                    vm.setReg(arg_regs[i], arguments[i]);
                }
                vm.runFuncAt(func_offset);
            });
        };
        this.ops[OP.COMP_EQUAL] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left == right);
        };
        this.ops[OP.COMP_NOT_EQUAL] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left != right);
        };
        this.ops[OP.COMP_STRICT_EQUAL] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left === right);
        };
        this.ops[OP.COMP_STRICT_NOT_EQUAL] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left !== right);
        };
        this.ops[OP.COMP_LESS_THAN] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left < right);
        };
        this.ops[OP.COMP_GREATHER_THAN] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left > right);
        };
        this.ops[OP.COMP_LESS_THAN_EQUAL] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left <= right);
        };
        this.ops[OP.COMP_GREATHER_THAN_EQUAL] = function(vm) {
            var dst = vm.getByte(), left = vm.getByte(), right = vm.getByte();
            left = vm.getReg(left);
            right = vm.getReg(right);
            vm.setReg(dst, left >= right);
        };
        this.ops[OP.ADD] = function(vm) {
            var dst = vm.getByte(), src0 = vm.getByte(), src1 = vm.getByte();
            vm.setReg(dst, vm.getReg(src0) + vm.getReg(src1));
        };
        this.ops[OP.MUL] = function(vm) {
            var dst = vm.getByte(), src0 = vm.getByte(), src1 = vm.getByte();
            vm.setReg(dst, vm.regs[src0] * vm.regs[src1]);
        };
        this.ops[OP.MINUS] = function(vm) {
            var dst = vm.getByte(), src0 = vm.getByte(), src1 = vm.getByte();
            vm.setReg(dst, vm.regs[src0] - vm.regs[src1]);
        };
        this.ops[OP.DIV] = function(vm) {
            var dst = vm.getByte(), src0 = vm.getByte(), src1 = vm.getByte();
            vm.setReg(dst, vm.regs[src0] / vm.regs[src1]);
        };
    }

    setReg(reg, value){
        this.regs[reg] = value;
    }

    getReg(reg){
        return this.regs[reg];
    }

    getByte(){
        return this.bytecode[this.regs[REGS.BYTECODE_PTR]++];
    }

    run(){
        while (this.regs[REGS.BYTECODE_PTR] < this.bytecode.length) {
            var op_code = this.getByte();

            var op = this.ops[op_code];

            try {
                op(this);
            } catch (e) {
                console.log("Current stack ptr: ", this.regs[REGS.BYTECODE_PTR], "op code: ", op_code);

                throw e;
            }
        }
        return 0;
    }

    runFuncAt(offset){
        this.reg_backups.push([this.regs.slice(), REGS.BCFUNC_RETURN]);
        this.runAt(offset);
    }

    runAt(offset){
        this.setReg(REGS.BYTECODE_PTR, offset);
        this.run();
    }

    init(bytecode){
        this.bytecode = this._decodeBytecode(bytecode);
        this.setReg(REGS.BYTECODE_PTR, 0);
        this.setReg(REGS.WINDOW, window);
        this.setReg(REGS.NUM_0, 0);
        this.setReg(REGS.NUM_1, 1);
        this.setReg(REGS.VOID, void 0);
        this.setReg(47, clearInterval);
        this.setReg(2, document);
        this.setReg(76, Object);
        this.setReg(46, setInterval);
        this.setReg(108, requestAnimationFrame);
        this.setReg(20, Math);
    }

    _decodeBytecode(encodedBytecode){
        var bytecode = window.atob(encodedBytecode);
        var bytes = [];
        var byteCounter = 0;
        for (var i = 0;i < bytecode.length;i++) {
            var b = bytecode.charCodeAt(i);

            if (b > 255) {
                bytes[byteCounter++] = b & 255;

                b >>= 8;
            }

            bytes[byteCounter++] = b;
        }
        return bytes;
    }

    _loadString(){
        var stringLength = this.getByte() << 8 || this.getByte();
        var string = "";
        for (var i = 0;i < stringLength;i++) {
            string += String.fromCharCode(this.getByte());
        }
        return string;
    }

    _loadArrayFromRegister(){
        var arrayLength = this.getByte();
        var array = [];
        for (var i = 0;i < arrayLength;i++) {
            array.push(this.getReg(this.getByte()));
        }
        return array;
    }

    _loadFloat(){
        var binary = "";
        for (let i = 0;i < 8;++i) {
            binary += this.getByte().toString(2).padStart(8, '0');
        }
        var sign = binary.charAt(0) == '1' ? -1 : 1;
        var exponent = parseInt(binary.substr(1, 11), 2);
        var significandBase = binary.substr(12);
        var significandBin;
        if (exponent == 0) {
            if (significandBase.indexOf('1') == -1) {
                return 0;
            } else {
                exponent = -0x3fe;

                significandBin = '0' + significandBase;
            }
        } else {
            exponent -= 0x3ff;

            significandBin = '1' + significandBase;
        }
        var significand = 0;
        for (let i = 0, val = 1;i < significandBin.length;(++i, val /= 2)) {
            significand += val * parseInt(significandBin.charAt(i));
        }
        return sign * significand * Math.pow(2, exponent);
    }

    _loadLongNum(){
        var num = this.getByte() << 24 | this.getByte() << 16 | this.getByte() << 8 | this.getByte();
        return num;
    }

    _loadRegistersArray(){
        var arrayLength = this.getByte();
        var registers_array = [];
        for (var i = 0;i < arrayLength;i++) {
            registers_array.push(this.getByte());
        }
        return registers_array;
    }
}

module.exports = { VM, OP, REGS };