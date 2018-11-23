import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parseProgram} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let a = 1;'))),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"1"}]'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function testFunc(x,y)\n' +
                '{\n' +
                'return x+y;\n' +
                '}'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'function declaration',
                    'Name': 'testFunc',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'y',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 3,
                    'Type': 'return statement',
                    'Name': '',
                    'Condition': '',
                    'Value': 'x + y'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function testFunc(x,y)\n' +
                '{\n' +
                'if((x+y) > (x-y))\n' +
                'return x+y\n' +
                'else\n' +
                'return x-y\n' +
                '}'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'function declaration',
                    'Name': 'testFunc',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'y',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 3,
                    'Type': 'if statement',
                    'Name': '',
                    'Condition': 'x + y > x - y',
                    'Value': ''
                },
                {
                    'Line': 4,
                    'Type': 'return statement',
                    'Name': '',
                    'Condition': '',
                    'Value': 'x + y'
                },
                {
                    'Line': 6,
                    'Type': 'return statement',
                    'Name': '',
                    'Condition': '',
                    'Value': 'x - y'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let x=-1;\n' +
                'for(i=1;i<5;i++)\n' +
                'x++'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': '-1'
                },
                {
                    'Line': 2,
                    'Type': 'for statement',
                    'Name': '',
                    'Condition': 'i < 5',
                    'Value': ''
                },
                {
                    'Line': 2,
                    'Type': 'assignment expression',
                    'Name': 'i',
                    'Condition': '',
                    'Value': '1'
                },
                {
                    'Line': 2,
                    'Type': 'update expression',
                    'Name': 'i',
                    'Condition': '',
                    'Value': 'i++'
                },
                {
                    'Line': 3,
                    'Type': 'update expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x++'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let x=1;\n' +
                'if(x<1)\n' +
                'x=x+1;\n' +
                'else if(x>2)\n' +
                '\tx=x+2\n' +
                '\telse\n' +
                '\tif(x<2)\n' +
                '\tx=x+3'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': '1'
                },
                {
                    'Line': 2,
                    'Type': 'if statement',
                    'Name': '',
                    'Condition': 'x < 1',
                    'Value': ''
                },
                {
                    'Line': 3,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 1'
                },
                {
                    'Line': 4,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': 'x > 2',
                    'Value': ''
                },
                {
                    'Line': 5,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 2'
                },
                {
                    'Line': 7,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': 'x < 2',
                    'Value': ''
                },
                {
                    'Line': 8,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 3'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('\n' +
                'let x=1;\n' +
                'if(x<1)\n' +
                'x=x+1;\n' +
                'else x=x+2;'))),
            JSON.stringify([
                {
                    'Line': 2,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': '1'
                },
                {
                    'Line': 3,
                    'Type': 'if statement',
                    'Name': '',
                    'Condition': 'x < 1',
                    'Value': ''
                },
                {
                    'Line': 4,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 1'
                },
                {
                    'Line': 5,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 2'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let x=1;\n' +
                'if(x<1){\n' +
                'x=x+1\n' +
                '}'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': '1'
                },
                {
                    'Line': 2,
                    'Type': 'if statement',
                    'Name': '',
                    'Condition': 'x < 1',
                    'Value': ''
                },
                {
                    'Line': 3,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 1'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('let x=1;\n' +
                'if(x<1)\n' +
                'x=x+1;\n' +
                'else if(x<0)\n' +
                '\tx=x+2;\n'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': '1'
                },
                {
                    'Line': 2,
                    'Type': 'if statement',
                    'Name': '',
                    'Condition': 'x < 1',
                    'Value': ''
                },
                {
                    'Line': 3,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 1'
                },
                {
                    'Line': 4,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': 'x < 0',
                    'Value': ''
                },
                {
                    'Line': 5,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 2'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function test(){\n' +
                'let x=3;\n' +
                'for(i=0;i<=5;i=i++)\n' +
                '{\n' +
                'x=x+1;\n' +
                '}\n' +
                'return x;\n' +
                '}'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'function declaration',
                    'Name': 'test',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 2,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Value': '3'
                },
                {
                    'Line': 3,
                    'Type': 'for statement',
                    'Name': '',
                    'Condition': 'i <= 5',
                    'Value': ''
                },
                {
                    'Line': 3,
                    'Type': 'assignment expression',
                    'Name': 'i',
                    'Condition': '',
                    'Value': '0'
                },
                {
                    'Line': 3,
                    'Type': 'assignment expression',
                    'Name': 'i',
                    'Condition': '',
                    'Value': 'i ++ '
                },
                {
                    'Line': 5,
                    'Type': 'assignment expression',
                    'Name': 'x',
                    'Condition': '',
                    'Value': 'x + 1'
                },
                {
                    'Line': 7,
                    'Type': 'return statement',
                    'Name': '',
                    'Condition': '',
                    'Value': 'x'
                }
            ])
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseProgram(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/(2+7);\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -(-6);\n' +
                '}'))),
            JSON.stringify([
                {
                    'Line': 1,
                    'Type': 'function declaration',
                    'Name': 'binarySearch',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'X',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'V',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'n',
                    'Condition': '',
                    'Value': ''
                },
                {
                    'Line': 2,
                    'Type': 'variable declaration',
                    'Name': 'low',
                    'Condition': '',
                    'Value': 'NULL'
                },
                {
                    'Line': 2,
                    'Type': 'variable declaration',
                    'Name': 'high',
                    'Condition': '',
                    'Value': 'NULL'
                },
                {
                    'Line': 2,
                    'Type': 'variable declaration',
                    'Name': 'mid',
                    'Condition': '',
                    'Value': 'NULL'
                },
                {
                    'Line': 3,
                    'Type': 'assignment expression',
                    'Name': 'low',
                    'Condition': '',
                    'Value': '0'
                },
                {
                    'Line': 4,
                    'Type': 'assignment expression',
                    'Name': 'high',
                    'Condition': '',
                    'Value': 'n - 1'
                },
                {
                    'Line': 5,
                    'Type': 'while statement',
                    'Name': '',
                    'Condition': 'low <= high',
                    'Value': ''
                },
                {
                    'Line': 6,
                    'Type': 'assignment expression',
                    'Name': 'mid',
                    'Condition': '',
                    'Value': '(low + high) / (2 + 7)'
                },
                {
                    'Line': 7,
                    'Type': 'if statement',
                    'Name': '',
                    'Condition': 'X < V[mid]',
                    'Value': ''
                },
                {
                    'Line': 8,
                    'Type': 'assignment expression',
                    'Name': 'high',
                    'Condition': '',
                    'Value': 'mid - 1'
                },
                {
                    'Line': 9,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': 'X > V[mid]',
                    'Value': ''
                },
                {
                    'Line': 10,
                    'Type': 'assignment expression',
                    'Name': 'low',
                    'Condition': '',
                    'Value': 'mid + 1'
                },
                {
                    'Line': 12,
                    'Type': 'return statement',
                    'Name': '',
                    'Condition': '',
                    'Value': 'mid'
                },
                {
                    'Line': 14,
                    'Type': 'return statement',
                    'Name': '',
                    'Condition': '',
                    'Value': '-(-6)'
                }
            ])
        );
    });
});
