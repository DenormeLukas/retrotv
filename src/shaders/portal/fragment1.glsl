    precision mediump float;

    uniform vec3 iResolution;
    uniform float iTime;

//  Let's make some TV Noise

// Inspired by https://www.youtube.com/watch?v=zXsWftRdsvU
// Value Noise Explained

float Noise21 (vec2 p, float ta, float tb) {
    return fract(sin(p.x*ta+p.y*tb)*5678.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord/iResolution.xy;

    float t = iTime; // tweak the start moment
    float ta = t*.654321;
    float tb = t*(ta*.123456);
    
    float c = Noise21(uv, ta, tb);
    vec3 col = vec3(c);

    fragColor = vec4(col,1.);
}

    
void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);

}