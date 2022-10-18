    precision mediump float;

    uniform vec3 iResolution;
    uniform float iTime;
    uniform sampler2D iChannel0;

// Rand one-liner
float rand(vec2 co)
{
	return fract (sin (dot (co.xy, vec2 (12.9898, 78.233))) * 43758.5453);
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

    // Time varying pixel color
    vec3 movement = 0.5 + 0.5 * cos (iTime + uv.xyx + vec3 (0, 2, 4));
    
    // Noise value at given Y
    float noise = rand (vec2 (iTime, uv.y));
    
    // Noise color
    vec3 col = (vec3 (noise * 0.5, noise * 0.8, noise) + 2.0) * 0.3;
    
    // Adds static
    col *= (rand (uv * iTime) + 3.0) * 0.3;

    // Output to screen
    fragColor = vec4 (col * movement, 1.0);
} 
    
void main() {

    mainImage(gl_FragColor, gl_FragCoord.xy);

}