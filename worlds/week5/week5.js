"use strict"


const VERTEX_SIZE = 6; // EACH VERTEX CONSISTS OF: x,y,z, ny,ny,nz

class Mat {
    constructor(height, width, v = 0.0) {
        this.w = width;
        this.h = height;
        this._mat = [];
        for (var i = 0; i < this.h * this.w; i++) {
            this._mat[i] = v;
        }
    }

    size() {
        return [this.h, this.w];
    }

    elem(i, j) {
        if (i >= 0 && i < this.h && j >= 0 && j < this.w) {
            var idx = j * this.h + i;
            return this._mat[idx];
        }
    }

    set(i, j, v) {
        if (i >= 0 && i < this.h && j >= 0 && j < this.w) {
            var idx = j * this.h + i;
            this._mat[idx] = v;
        }
    }

    transpose() {
        let ret = new Mat(this.w, this.h, 0.0);
        for (var i = 0; i < this.h; i++) {
            for (var j = 0; j < this.w; j++) {
                ret.set(j, i, this.elem(i, j));
            }
        }
        return ret;
    }

    t() {
        return this.transpose();
    }

    print() {
        var str = "";
        for (var i = 0; i < this.h; i++) {
            for (var j = 0; j < this.w; j++) {
                str = str + this.elem(i, j) + " ";
            }
            str += "\n";
        }
        console.log(str);
    }

    // col by col
    toList() {
        return this._mat;;
    }

    // col by col
    static fromList(height, width, vector) {
        if (vector.length != height * width) {
            throw "Dimensions do not match!";
        }
        let ret = new Mat(height, width, 0.);
        ret._mat = vector;
        return ret;
    }

    static diag(n, vector) {
        if (vector.length != n) {
            throw "Dimensions do not match!";
        }
        let ret = new Mat(n, n, 0.);
        for (var i = 0; i < n; i++) {
            ret.set(i, i, vector[i]);
        }
        return ret;
    }


    static mat_add(A, B) {
        if (A.w != B.w || A.h != B.h) {
            throw "Dimensions do not match!";
        }

        let C = new Mat(A.h, B.w, 0.0);
        for (var i = 0; i < A.h; ++i) {
            for (var j = 0; j < B.w; ++j) {
                C.set(i, j, A.elem(i, j) + B.elem(i, j));
            }
        }
        return C;
    }

    static multiply(A, B) {
        if (A.w != B.h) {
            throw "Dimensions do not match!";
        }

        let C = new Mat(A.h, B.w, 0.0);

        for (var i = 0; i < A.h; ++i) {
            for (var j = 0; j < B.w; ++j) {
                var tmp = 0.0;
                for (var k = 0; k < A.w; ++k) {
                    tmp += A.elem(i, k) * B.elem(k, j);
                }
                C.set(i, j, tmp);
            }
        }
        return C;
    }

    inv() {
        let src = this._mat;
        let dst = [], det = 0, cofactor = (c, r) => {
            let s = (i, j) => src[c + i & 3 | (r + j & 3) << 2];
            return (c + r & 1 ? -1 : 1) * ((s(1, 1) * (s(2, 2) * s(3, 3) - s(3, 2) * s(2, 3)))
                - (s(2, 1) * (s(1, 2) * s(3, 3) - s(3, 2) * s(1, 3)))
                + (s(3, 1) * (s(1, 2) * s(2, 3) - s(2, 2) * s(1, 3))));
        }
        for (let n = 0; n < 16; n++) dst.push(cofactor(n >> 2, n & 3));
        for (let n = 0; n < 4; n++) det += src[n] * dst[n << 2];
        for (let n = 0; n < 16; n++) dst[n] /= det;

        let ret = Mat.fromList(4, 4, dst);
        // ret._mat = inverse(this._mat);
        return ret;
    }

    static identity() {
        return Mat.diag(4, [1, 1, 1, 1]);
    }

    static translate(x, y, z) {
        let trans = Mat.identity();
        trans.set(0, 3, x);
        trans.set(1, 3, y);
        trans.set(2, 3, z);
        return trans;
    }

    static scale(x, y, z) {
        return Mat.diag(4, [x, y, z, 1]);
    }

    static perspective(x, y, z, w) {
        let trans = Mat.identity();
        trans.set(3, 0, x);
        trans.set(3, 1, y);
        trans.set(3, 2, z);
        trans.set(3, 3, w);
        return trans;
    }

    static rotateX(th) {
        var c = Math.cos(th);
        var s = Math.sin(th);

        let trans = Mat.diag(4, [1, c, c, 1]);
        trans.set(1, 2, -s);
        trans.set(2, 1, s);
        return trans;
    }

    static rotateY(th) {
        var c = Math.cos(th);
        var s = Math.sin(th);

        let trans = Mat.diag(4, [c, 1, c, 1]);
        trans.set(0, 2, s);
        trans.set(2, 0, -s);
        return trans;
    }

    static rotateZ(th) {
        var c = Math.cos(th);
        var s = Math.sin(th);

        let trans = Mat.diag(4, [c, c, 1, 1]);
        trans.set(0, 1, -s);
        trans.set(1, 0, s);
        return trans;
    }
}


 //////////////////////////////////////////////////////////////////
//                                                                //
//  FOR HOMEWORK, YOU CAN ALSO TRY DEFINING DIFFERENT SHAPES,     //
//  BY CREATING OTHER VERTEX ARRAYS IN ADDITION TO cubeVertices.  //
//                                                                //
 //////////////////////////////////////////////////////////////////

let createCubeVertices = () => {
   let v = [];
   let addVertex = a => {
      for (let i = 0 ; i < a.length ; i++)
         v.push(a[i]);
   }

   // EACH SQUARE CONSISTS OF TWO TRIANGLES.

   let addSquare = (a,b,c,d) => {
      addVertex(c);
      addVertex(b);
      addVertex(a);

      addVertex(b);
      addVertex(c);
      addVertex(d);
   }

   // VERTEX DATA FOR TWO OPPOSING SQUARE FACES. EACH VERTEX CONSISTS OF: x,y,z, nx,ny,nz

   let P = [[-1,-1,-1, 0,0,-1],[ 1,-1,-1, 0,0,-1],[-1, 1,-1, 0,0,-1],[ 1, 1,-1, 0,0,-1],
            [-1,-1, 1, 0,0, 1],[ 1,-1, 1, 0,0, 1],[-1, 1, 1, 0,0, 1],[ 1, 1, 1, 0,0, 1]];

   // LOOP THROUGH x,y,z. EACH TIME ADD TWO OPPOSING FACES, THEN PERMUTE COORDINATES.

   for (let n = 0 ; n < 3 ; n++) {
      addSquare(P[0],P[1],P[2],P[3]);
      addSquare(P[4],P[5],P[6],P[7]);
      for (let i = 0 ; i < P.length ; i++)
         P[i] = [P[i][1],P[i][2],P[i][0], P[i][4],P[i][5],P[i][3]];
   }
   return v;
}

let vecLength = a => {
    let len = 0;
    for (let i = 0 ; i < a.length ; i++) {
        len += a[i]**2; 
    }
    len = Math.sqrt(len);
    return len;
}

let normalize = a => {
    let len = vecLength(a);
    if (len <= 0) throw "0 vector!";
    let ret = [];
    
    for (let i = 0; i < a.length; i++) {
        ret.push(a[i] / len);
    }
    return ret;
}

let vecMinus = (a, b) => {
    if (a.length != b.length) {
        throw "Sizes don't match!";
    }
    let ret = [];
    for(var i = 0; i < a.length; i++) {
        ret.push(a[i] - b[i]);
    }
    return ret;
}

// Counterclockwise
// return a 3d-vec, (n1, n2, n3)
let triangleNormal = (a, b, c) => {
    let n1 = vecMinus(b, a);
    let n2 = vecMinus(c, b);

    let x = n2[2]*n1[1] - n2[1]*n1[2];
    let y = n2[0]*n1[2] - n1[0]*n2[2];
    let z = n1[0]*n2[1] - n2[0]*n1[1];

    return normalize([x, y, z]);
}

let createOctahedron = () => {
    let v = [];
    
    let addVertex = (a, an) => {
       for (let i = 0 ; i < a.length ; i++)
          v.push(a[i]);
        for (let i = 0 ; i < an.length ; i++)
          v.push(an[i]);
    }

    let addTriangle = (a, b, c) => {
        let n = triangleNormal(a, b, c);
        addVertex(a, n);
        addVertex(b, n);
        addVertex(c, n);
    }

    let AddPyramid = (t, a, b, c, d) => {
        addTriangle(t, a, b);
        addTriangle(t, b, c);
        addTriangle(t, c, d);
        addTriangle(t, d, a);
    }

    let t = [[0, 1, 0], [0, -1, 0]];
    let P = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]];

    AddPyramid(t[0], P[0], P[1], P[2], P[3]);
    AddPyramid(t[1], P[3], P[2], P[1], P[0]);
    return v;
}

let cubeVertices = createCubeVertices();
let octahedron = createOctahedron();

async function setup(state) {
    hotReloadFile(getPath('week5.js'));

    state.m = new Matrix();

    let libSources = await MREditor.loadAndRegisterShaderLibrariesForLiveEditing(gl, "libs", [
        { 
            key : "pnoise", path : "shaders/noise.glsl", foldDefault : true
        },
        {
            key : "sharedlib1", path : "shaders/sharedlib1.glsl", foldDefault : true
        },      
    ]);

    if (!libSources) {
        throw new Error("Could not load shader library");
    }

    // load vertex and fragment shaders from the server, register with the editor
    let shaderSource = await MREditor.loadAndRegisterShaderForLiveEditing(
        gl,
        "mainShader",
        { 
            onNeedsCompilation : (args, libMap, userData) => {
                const stages = [args.vertex, args.fragment];
                const output = [args.vertex, args.fragment];

                const implicitNoiseInclude = true;
                if (implicitNoiseInclude) {
                    let libCode = MREditor.libMap.get("pnoise");

                    for (let i = 0; i < 2; i += 1) {
                        const stageCode = stages[i];
                        const hdrEndIdx = stageCode.indexOf(';');
                        
                        /*
                        const hdr = stageCode.substring(0, hdrEndIdx + 1);
                        output[i] = hdr + "\n#line 1 1\n" + 
                                    libCode + "\n#line " + (hdr.split('\n').length) + " 0\n" + 
                                    stageCode.substring(hdrEndIdx + 1);
                        console.log(output[i]);
                        */
                        const hdr = stageCode.substring(0, hdrEndIdx + 1);
                        
                        output[i] = hdr + "\n#line 2 1\n" + 
                                    "#include<pnoise>\n#line " + (hdr.split('\n').length + 1) + " 0" + 
                            stageCode.substring(hdrEndIdx + 1);

                        //console.log(output[i]);
                    }
                }

                MREditor.preprocessAndCreateShaderProgramFromStringsAndHandleErrors(
                    output[0],
                    output[1],
                    libMap
                );
            },
            onAfterCompilation : (program) => {
                state.program = program;

                gl.useProgram(program);

                state.uColorLoc        = gl.getUniformLocation(program, 'uColor');
                state.uCursorLoc       = gl.getUniformLocation(program, 'uCursor');
                state.uModelLoc        = gl.getUniformLocation(program, 'uModel');
                state.uProjLoc         = gl.getUniformLocation(program, 'uProj');
                state.uTimeLoc         = gl.getUniformLocation(program, 'uTime');
                state.uViewLoc         = gl.getUniformLocation(program, 'uView');

                state.eyeLoc           = gl.getUniformLocation(program, 'eye');
                state.screenCenterLoc  = gl.getUniformLocation(program, 'screen_center');

                var NS = 1;
                state.uMaterialsLoc = [];
                for (var i = 0; i < NS; i++) {
                    state.uMaterialsLoc[i] = {};
                    state.uMaterialsLoc[i].diffuse  = gl.getUniformLocation(program, 'uMaterials[' + i + '].diffuse');
                    state.uMaterialsLoc[i].ambient  = gl.getUniformLocation(program, 'uMaterials[' + i + '].ambient');
                    state.uMaterialsLoc[i].specular = gl.getUniformLocation(program, 'uMaterials[' + i + '].specular');
                    state.uMaterialsLoc[i].power    = gl.getUniformLocation(program, 'uMaterials[' + i + '].power');
                    state.uMaterialsLoc[i].reflectc = gl.getUniformLocation(program, 'uMaterials[' + i + '].reflectc');
                    state.uMaterialsLoc[i].refraction = gl.getUniformLocation(program, 'uMaterials[' + i + '].refraction');
                    state.uMaterialsLoc[i].transparent = gl.getUniformLocation(program, 'uMaterials[' + i + '].transparent');
               
                    state.lightsLoc = [];         
                }       
                for (var i = 0; i < 3; i++) {
                    state.lightsLoc[i] = {};
                    state.lightsLoc[i].src = gl.getUniformLocation(program, 'lights[' + i + '].src');
                    state.lightsLoc[i].rgb = gl.getUniformLocation(program, 'lights[' + i + '].rgb');
                }
            } 
        },
        {
            paths : {
                vertex   : "shaders/vertex.vert.glsl",
                fragment : "shaders/fragment.frag.glsl"
            },
            foldDefault : {
                vertex   : true,
                fragment : false
            }
        }
    );

    state.cursor = ScreenCursor.trackCursor(MR.getCanvas());

    if (!shaderSource) {
        throw new Error("Could not load shader");
    }

    // Create a square as a triangle strip consisting of two triangles
    state.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, state.buffer);

 ///////////////////////////////////////////////////////////
//                                                         //
//  HINT: IF YOU WANT TO IMPLEMENT MORE THAN ONE SHAPE,    //
//  YOU MIGHT WANT TO CALL gl.bufferData()                 //
//  MULTIPLE TIMES IN onDraw() INSTEAD OF HERE,            //
//  USING OTHER ARRAY VALUES IN ADDITION TO cubeVertices.  //
//                                                         //
 ///////////////////////////////////////////////////////////

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( cubeVertices ), gl.STATIC_DRAW);

   


    let bpe = Float32Array.BYTES_PER_ELEMENT;

    let aPos = gl.getAttribLocation(state.program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, bpe * VERTEX_SIZE, bpe * 0);

    let aNor = gl.getAttribLocation(state.program, 'aNor');
    gl.enableVertexAttribArray(aNor);
    gl.vertexAttribPointer(aNor, 3, gl.FLOAT, false, bpe * VERTEX_SIZE, bpe * 3);
}


 /////////////////////////////////////////////////////////////////////
//                                                                   //
//  FOR HOMEWORK, YOU NEED TO IMPLEMENT THESE SIX MATRIX FUNCTIONS.  //
//  EACH FUNCTION SHOULD RETURN AN ARRAY WITH 16 VALUES.             //
//                                                                   //
//  SINCE YOU ALREADY DID THIS FOR THE PREVIOUS ASSIGNMENT,          //
//  YOU CAN JUST USE THE FUNCTION DEFINITIONS YOU ALREADY CREATED.   //
//                                                                   //
 /////////////////////////////////////////////////////////////////////

let identity = ()       => Mat.identity().toList();
let rotateX = t         => Mat.rotateX(t).toList();
let rotateY = t         => Mat.rotateY(t).toList();
let rotateZ = t         => Mat.rotateZ(t).toList();
let scale = (x,y,z)     => Mat.scale(x, y, z).toList();
let translate = (x,y,z) => Mat.translate(x, y, z).toList();

let inverse = src => {
  let dst = [], det = 0, cofactor = (c, r) => {
     let s = (i, j) => src[c+i & 3 | (r+j & 3) << 2];
     return (c+r & 1 ? -1 : 1) * ( (s(1,1) * (s(2,2) * s(3,3) - s(3,2) * s(2,3)))
                                 - (s(2,1) * (s(1,2) * s(3,3) - s(3,2) * s(1,3)))
                                 + (s(3,1) * (s(1,2) * s(2,3) - s(2,2) * s(1,3))) );
  }
  for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3));
  for (let n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2];
  for (let n = 0 ; n < 16 ; n++) dst[n] /= det;
  return dst;
}

let multiply = (a, b) => {
   let c = [];
   for (let n = 0 ; n < 16 ; n++)
      c.push( a[n&3     ] * b[    n&12] +
              a[n&3 |  4] * b[1 | n&12] +
              a[n&3 |  8] * b[2 | n&12] +
              a[n&3 | 12] * b[3 | n&12] );
   return c;
}

let Matrix = function() {
   let topIndex = 0,
       stack = [ identity() ],
       getVal = () => stack[topIndex],
       setVal = m => stack[topIndex] = m;

   this.identity  = ()      => setVal(identity());
   this.restore   = ()      => --topIndex;
   this.rotateX   = t       => setVal(multiply(getVal(), rotateX(t)));
   this.rotateY   = t       => setVal(multiply(getVal(), rotateY(t)));
   this.rotateZ   = t       => setVal(multiply(getVal(), rotateZ(t)));
   this.save      = ()      => stack[++topIndex] = stack[topIndex-1].slice();
   this.scale     = (x,y,z) => setVal(multiply(getVal(), scale(x,y,z)));
   this.translate = (x,y,z) => setVal(multiply(getVal(), translate(x,y,z)));
   this.value     = ()      => getVal();
}

function onStartFrame(t, state) {

    state.color0 = [1,.5,.2];


    // uTime IS TIME IN SECONDS SINCE START TIME.

    if (!state.tStart)
        state.tStart = t;
    state.time = (t - state.tStart) / 1000;
    var time = state.time;

    gl.uniform1f (state.uTimeLoc  , state.time);


    gl.uniform3fv(state.eyeLoc, [0., 0., 5.]);
    gl.uniform3fv(state.screenCenterLoc, [0., 0., 2.5]);


    gl.uniform3fv(state.lightsLoc[0].src, [2.*Math.sin(time), 2.*Math.cos(time), -.5]);
    gl.uniform3fv(state.lightsLoc[0].rgb, [1., 1., 1.]);

    gl.uniform3fv(state.lightsLoc[1].src, [-1.5*Math.cos(time), 0., 1.5*Math.sin(time)]);
    gl.uniform3fv(state.lightsLoc[1].rgb, [1., 1., 1.]);

    gl.uniform3fv(state.lightsLoc[2].src, [0., 1.*Math.cos(time), 1.*Math.sin(time)]);
    gl.uniform3fv(state.lightsLoc[2].rgb, [1., 1., 1.]);


    // uCursor WILL GO FROM -1 TO +1 IN xy, WITH z = 0 FOR MOUSE UP, 1 FOR MOUSE DOWN.

    let cursorValue = () => {
       let p = state.cursor.position(), canvas = MR.getCanvas();
       return [ p[0] / canvas.clientWidth * 2 - 1, 1 - p[1] / canvas.clientHeight * 2, p[2] ];
    }

    gl.uniform3fv(state.uCursorLoc, cursorValue());


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
}

function onDraw(t, projMat, viewMat, state, eyeIdx) {


    let m = state.m;

    gl.uniformMatrix4fv(state.uViewLoc, false, new Float32Array(viewMat));
    gl.uniformMatrix4fv(state.uProjLoc, false, new Float32Array(projMat));


 //////////////////////////////////////////////////////////////////////
//                                                                    //
//  THIS IS THE EXAMPLE OF TWO WAVING ARMS THAT WE CREATED IN CLASS.  //
//  FOR HOMEWORK, YOU WILL WANT TO DO SOMETHING DIFFERENT.            //
//                                                                    //
 //////////////////////////////////////////////////////////////////////

    m.save();
    m.identity();
    m.translate(0,0,-6);

    m.translate(2*Math.cos(state.time),0,2*Math.sin(state.time));
    m.rotateZ(0.5*Math.cos(state.time));


    m.save();
        m.scale(.9,.05,.9);
        m.rotateY(state.time);
        // gl.uniform3fv(state.uColorLoc, state.color0 );
        gl.uniform3fv(state.uMaterialsLoc[0].ambient , [1.,0.37,0.]);
        gl.uniform3fv(state.uMaterialsLoc[0].diffuse , [1.,0.37,0.]);
        gl.uniform3fv(state.uMaterialsLoc[0].specular, [0.,1.,1.]);
        gl.uniform1f (state.uMaterialsLoc[0].power   , 20.);
        gl.uniform3fv(state.uMaterialsLoc[0].reflectc , [1.0,1.0,1.0]);
        gl.uniform3fv(state.uMaterialsLoc[0].transparent, [0.5,0.5,0.5]);
        gl.uniform1f (state.uMaterialsLoc[0].refraction   , 1.5);

        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / VERTEX_SIZE);

        m.save();
            gl.uniform3fv(state.uMaterialsLoc[0].ambient , [0.,0.37,0.]);
            gl.uniform3fv(state.uMaterialsLoc[0].diffuse , [0.,0.37,0.]);
            gl.uniform3fv(state.uMaterialsLoc[0].specular, [0.,1.,1.]);
            gl.uniform1f (state.uMaterialsLoc[0].power   , 20.);
            gl.uniform3fv(state.uMaterialsLoc[0].reflectc , [1.0,1.0,1.0]);
            gl.uniform3fv(state.uMaterialsLoc[0].transparent, [0.5,0.5,0.5]);
            gl.uniform1f (state.uMaterialsLoc[0].refraction   , 1.5);
            m.scale(0.1,1,-.1);

            m.translate(0, 2 + 20*Math.abs(Math.cos(5*state.time)), 0);
            gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
            gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / VERTEX_SIZE);
        m.restore();

    m.restore();
    m.save();
        m.scale(.7, .05, .7);
        m.rotateY(2*state.time);
        m.translate(0., -2.0, 0.);

        // gl.uniform3fv(state.uColorLoc, [0., 1., 0.]);
        gl.uniform3fv(state.uMaterialsLoc[0].ambient , [0.0, 0.4, 0.4]);
        gl.uniform3fv(state.uMaterialsLoc[0].diffuse , [0.0, 0.25, 0.25]);
        gl.uniform3fv(state.uMaterialsLoc[0].specular, [1.,1.,1.]);
        gl.uniform1f (state.uMaterialsLoc[0].power   , 20.);
        gl.uniform3fv(state.uMaterialsLoc[0].reflectc , [0.5, 0.5, 0.5]);
        gl.uniform3fv(state.uMaterialsLoc[0].transparent, [1.0, 1.0, 1.0]);
        gl.uniform1f (state.uMaterialsLoc[0].refraction   , 1.5);

        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / VERTEX_SIZE);
    m.restore();

    m.save();
        m.scale(.5, .05, .5);
        m.rotateY(3*state.time);
        m.translate(0., -4.0, 0.);

        // gl.uniform3fv(state.uColorLoc, [0., 1., 0.]);
        gl.uniform3fv(state.uMaterialsLoc[0].ambient , [0.03, 0.1, 0.0]);
        gl.uniform3fv(state.uMaterialsLoc[0].diffuse , [0.05, 0.25, 0.0]);
        gl.uniform3fv(state.uMaterialsLoc[0].specular, [1.,1.,1.]);
        gl.uniform1f (state.uMaterialsLoc[0].power   , 20.);
        gl.uniform3fv(state.uMaterialsLoc[0].reflectc , [0.5, 0.5, 0.5]);
        gl.uniform3fv(state.uMaterialsLoc[0].transparent, [1.0, 1.0, 1.0]);
        gl.uniform1f (state.uMaterialsLoc[0].refraction   , 1.5);

        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / VERTEX_SIZE);
    m.restore();

    m.save();
        m.scale(.3, .05, .3);
        m.rotateY(4*state.time);
        m.translate(0., -6.0, 0.);

        // gl.uniform3fv(state.uColorLoc, [0., 1., 0.]);
        gl.uniform3fv(state.uMaterialsLoc[0].ambient , [0.57, 0.8, 0.84]);
        gl.uniform3fv(state.uMaterialsLoc[0].diffuse , [0.57, 0.8, 0.84]);
        gl.uniform3fv(state.uMaterialsLoc[0].specular, [1.,1.,1.]);
        gl.uniform1f (state.uMaterialsLoc[0].power   , 20.);
        gl.uniform3fv(state.uMaterialsLoc[0].reflectc , [0.5, 0.5, 0.5]);
        gl.uniform3fv(state.uMaterialsLoc[0].transparent, [1.0, 1.0, 1.0]);
        gl.uniform1f (state.uMaterialsLoc[0].refraction   , 1.5);

        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / VERTEX_SIZE);
    m.restore();

    m.save();
        m.scale(.1, .05, .1);
        m.rotateY(4*state.time);
        m.translate(0., -8.0, 0.);

        // gl.uniform3fv(state.uColorLoc, [0., 1., 0.]);
        gl.uniform3fv(state.uMaterialsLoc[0].ambient , [0.36, 0., 0.4]);
        gl.uniform3fv(state.uMaterialsLoc[0].diffuse , [0.36, 0., 0.4]);
        gl.uniform3fv(state.uMaterialsLoc[0].specular, [1.,1.,1.]);
        gl.uniform1f (state.uMaterialsLoc[0].power   , 20.);
        gl.uniform3fv(state.uMaterialsLoc[0].reflectc , [0.5, 0.5, 0.5]);
        gl.uniform3fv(state.uMaterialsLoc[0].transparent, [1.0, 1.0, 1.0]);
        gl.uniform1f (state.uMaterialsLoc[0].refraction   , 1.5);

        gl.uniformMatrix4fv(state.uModelLoc, false, m.value() );
        gl.drawArrays(gl.TRIANGLES, 0, cubeVertices.length / VERTEX_SIZE);
    m.restore();

    m.restore();
    
    var bpe = Float32Array.BYTES_PER_ELEMENT;

    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(octahedron), gl.STATIC_DRAW, cubeVertices.length * bpe);
    // gl.drawArrays(gl.TRIANGLES, 36, octahedron.length / VERTEX_SIZE);

}

function onEndFrame(t, state) {
}

export default function main() {
    const def = {
        name         : 'week5',
        setup        : setup,
        onStartFrame : onStartFrame,
        onEndFrame   : onEndFrame,
        onDraw       : onDraw,
    };

    return def;
}
