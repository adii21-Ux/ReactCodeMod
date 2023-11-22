const babel = require('@babel/core');
const fs = require('fs');
const main = require('./lib/index')

const Code = ` import PropTypes from 'prop-types';
import { Component } from 'react';

export class HelloWorld extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className } = this.props;

    return
    (
      <div>
      <h1>Heading</h1>
      <div className={className}>Hello world!</div>
        </div>
    );
  }
} `

function transpileCode() {
  const transpiledCode = babel.transform(Code, {
    plugins: ["babel-plugin-transform-react-class-to-function"]
  });

  console.log(transpiledCode['code'])
  // reverseCode(transpiledCode['code'])
}

function reverseCode(transpiledCode) {
  // Restore 'var' declarations from 'const' and 'let'
  const reversedCode = transpiledCode
    .replace(/const (\w+) = /g, 'var $1 = ')
    .replace(/let (\w+) = /g, 'var $1 = ');

  // Restore arrow functions to traditional function expressions
  const arrowFunctionPattern = /(\w+) =>/g;
  let match;
  while ((match = arrowFunctionPattern.exec(reversedCode)) !== null) {
    const arrowFunction = match[0];
    const functionName = match[1];
    const functionStart = reversedCode.indexOf(arrowFunction);

    // Check if it's a variable assignment or function parameter
    const precedingCode = reversedCode.substring(0, functionStart);
    if (precedingCode.includes(`${functionName} = `)) {
      // It's a variable assignment, replace '=>' with 'function'
      reversedCode = reversedCode.replace(arrowFunction, `function ${functionName}`);
    }
  }

  console.log(reversedCode)
}


transpileCode();