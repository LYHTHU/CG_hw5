#version 300 es        // NEWER VERSION OF GLSL
precision highp float; // HIGH PRECISION FLOATS

uniform vec3  uColor;
uniform vec3  uCursor; // CURSOR: xy=pos, z=mouse up/down
uniform float uTime;   // TIME, IN SECONDS

in vec2 vXY;           // POSITION ON IMAGE
in vec3 vPos;          // POSITION
in vec3 vNor;          // NORMAL

uniform vec3 eye ; 
uniform vec3 screen_center; 


out vec4 fragColor;    // RESULT WILL GO HERE

const int NL = 3;
const int NS = 1;

struct Light{
    vec3 rgb; 
    vec3 src; 
}; 

struct Ray{
    vec3 src; 
    vec3 dir; 
}; 

struct Material{
    vec3 ambient; 
    vec3 diffuse; 
    vec3 specular; 
    float power;
    vec3 reflectc;
    float refraction;
    vec3 transparent;
}; 

uniform Light lights[NL];
uniform Material uMaterials[NS];


Ray get_ray(vec3 p_src, vec3 p_dest){
    Ray ret; 
    ret.src = p_src; 
    ret.dir = normalize(p_dest - p_src); 
    return ret; 
}

vec3 get_normal(vec3 pos) { 
    return normalize(vNor);
}

Ray reflect_ray(Ray rin, vec3 norm){
    Ray ret; 
    ret.src = rin.src; 
    ret.dir = normalize(2.*dot(norm, rin.dir)*norm - rin.dir); 
    return ret; 
}


vec3 phong(vec3 inter_point, int index) {
    vec3 N=get_normal(inter_point);
    // vec3 color=uMaterials[index].ambient;
    vec3 color = vec3(0.5, 0., 0.);
    for(int j=0;j<NL;j++){
        Ray L = get_ray(inter_point,lights[j].src);
        Ray E = get_ray(inter_point, eye);
        Ray R = reflect_ray(L, N);
        color += lights[j].rgb*(uMaterials[index].diffuse*max(0.,dot(N,L.dir)));
        // color += lights[j].rgb*(vec3(0.1, 0., 0.)*max(0.,dot(N,L.dir)));

        float s;
        float er = dot(E.dir,R.dir);
        if(er > 0.){
            s = max(0.,exp(uMaterials[index].power*log(er)));
            // s = max(0., exp(20.*log(er)));

        }
        else{
            s = 0.;
        }
        color += lights[j].rgb*uMaterials[index].specular*s;
        // color += lights[j].rgb*vec3(1., 1., 1.)*s;
    }
    return color;
}

void main() {
    // vec3 lDir  = vec3(.57,.57,.57);
    // vec3 shade = vec3(.1,.1,.1) + vec3(1.,1.,1.) * max(0., dot(lDir, normalize(vNor)));
    // vec3 color = shade;
    vec3 color = phong(vPos, 0);
    // only changed if light is intersect to the object    

    // HIGHLIGHT CURSOR POSITION WHILE MOUSE IS PRESSED

    // if (uCursor.z > 0. && min(abs(uCursor.x - vXY.x), abs(uCursor.y - vXY.y)) < .01)
    //       color = vec3(1.,1.,1.);

    // Using way like uColor to set the uMaterials

    fragColor = vec4(sqrt(color), 1.0);
}


