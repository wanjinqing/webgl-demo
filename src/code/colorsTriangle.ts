import { CustomWebGLRenderingContext, getWebGLContext, initShaders } from '../lib/cuon-utils';

var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'uniform float u_Width;\n' +
  'uniform float u_Height;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y / u_Height, 1.0);\n' +
  '}\n';

// 彩色三角形
export function main() {
  var canvas = document.getElementById('webgl') as HTMLCanvasElement;

  var gl = getWebGLContext(canvas) as CustomWebGLRenderingContext;
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl) as number;
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  gl.clearColor(0,0,0,1);

  gl.clear(gl.COLOR_BUFFER_BIT); // 颜色缓存区, gl.DEPTH_BUFFER_BIT, gl.STENCIL_BUFFER_BIT, 深度缓冲区, 模板缓冲区

  gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffers(gl: CustomWebGLRenderingContext) {
  const n = 3;
  const vertices = new Float32Array([
    0, 0.5, 1, 0, 0,
    -0.5, -0.5, 0, 0, 0,
    0.5, -0.5, 0, 0, 0
  ]);
  const size = vertices.BYTES_PER_ELEMENT;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program!, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, size * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program!, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 5, size * 2);
  gl.enableVertexAttribArray(a_Color);

  return n;
}

// function initVertexBuffers(gl: CustomWebGLRenderingContext) {
//   var verticesColors = new Float32Array([
//     // Vertex coordinates and color
//      0.0,  0.5,  1.0,  0.0,  0.0, 
//     -0.5, -0.5,  0.0,  1.0,  0.0, 
//      0.5, -0.5,  0.0,  0.0,  1.0, 
//   ]);
//   var n = 3;

//   // Create a buffer object
//   var vertexColorBuffer = gl.createBuffer();  
//   if (!vertexColorBuffer) {
//     console.log('Failed to create the buffer object');
//     return false;
//   }

//   // Bind the buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

//   var FSIZE = verticesColors.BYTES_PER_ELEMENT;
//   //Get the storage location of a_Position, assign and enable buffer
//   var a_Position = gl.getAttribLocation(gl.program!, 'a_Position');
//   if (a_Position < 0) {
//     console.log('Failed to get the storage location of a_Position');
//     return -1;
//   }
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
//   gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

//   // Get the storage location of a_Position, assign buffer and enable
//   var a_Color = gl.getAttribLocation(gl.program!, 'a_Color');
//   if(a_Color < 0) {
//     console.log('Failed to get the storage location of a_Color');
//     return -1;
//   }
//   gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
//   gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

//   // Unbind the buffer object
//   gl.bindBuffer(gl.ARRAY_BUFFER, null);

//   return n;
// }
