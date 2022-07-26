import { CustomWebGLRenderingContext, getWebGLContext, initShaders } from '../lib/cuon-utils';
import sky from '../resources/sky.jpg';

var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

export function main() {
  var canvas = document.getElementById('webgl') as HTMLCanvasElement;

  var gl = getWebGLContext(canvas) as CustomWebGLRenderingContext;

  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  var n = initVertexBuffers(gl);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  initTextures(gl, n);

}

function initVertexBuffers(gl: CustomWebGLRenderingContext) {
  var vertices = new Float32Array([
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0,
  ]);
  var n = 4;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const size = vertices.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program!, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, size * 4, 0);
  gl.enableVertexAttribArray(a_Position);


  const a_TexCoord = gl.getAttribLocation(gl.program!, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, size * 4, size * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  return n;
}

function initTextures(gl: CustomWebGLRenderingContext, n: number) {
  const texture = gl.createTexture();
  const u_Sampler = gl.getUniformLocation(gl.program!, 'u_Sampler');
  const image = new Image();
  image.onload = () => {
    loadTexture(gl, n, texture!, u_Sampler!, image);
  }
  image.src = sky;
}
function loadTexture(gl: CustomWebGLRenderingContext, n: number, texture: WebGLTexture, u_Sampler: WebGLUniformLocation, image: HTMLImageElement) {
  // 图像预处理函数
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 翻转图像的y轴
  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 设置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // 将纹理图像分配给纹理对象
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // 将0号纹理传递给着色器中的取样器变量
  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}