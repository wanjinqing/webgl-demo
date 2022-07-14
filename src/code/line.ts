import { CustomWebGLRenderingContext, getWebGLContext, initShaders } from '../lib/cuon-utils';


const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform vec4 u_Transition;
  void main() {
    gl_Position = a_Position + u_Transition;
    gl_PointSize = 10.0;
  }
`;
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

export function main() {
  const canvas = document.getElementById('webgl') as HTMLCanvasElement;
  const gl = getWebGLContext(canvas) as CustomWebGLRenderingContext;
  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  const vertices = new Float32Array([
    0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5
  ]);
  const n = vertices.length / 2;
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program!, 'a_Position');
  const u_Transition = gl.getUniformLocation(gl.program!, 'u_Transition');
  // 平移
  gl.uniform4f(u_Transition, -0, -0, -0, 0);

  // 将缓冲区对象分配给_位置变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);


  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.drawArrays(gl.LINES, 0, n);
  // gl.drawArrays(gl.LINE_STRIP, 0, n);
  // gl.drawArrays(gl.LINE_LOOP, 0, n);
  // gl.drawArrays(gl.POINTS, 0, n);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  // gl.drawArrays(gl.TRIANGLES, 0, n);


}

// js执行，缓冲区对象，顶点着色器，片元着色器，颜色缓存区，浏览器
// 正旋转，右手法则旋转
// 新坐标 = 变换矩阵 * 旧坐标
