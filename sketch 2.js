//I did my undergraduate degree in computer design at the University of Sydney, so I've learnt about p5js before (the courses are Deco 1012,1016,2017,3100, 4 courses in total).
let imgProcessor;
let artRenderer;
let isDrawing = false; // Boolean variable to control whether an image is generated
let fallingRects = []; // Storage of falling rectangles
let isFalling = false; // Used to control whether to drop the rectangle or not

// ImageProcessor class to handle image loading and processing
class ImageProcessor {
    constructor(imagePath) {
        this.img = loadImage(imagePath); // Load the image
    }

    // Method to resize the image
    resizeImage(width, height) {
        this.img.resize(width, height); // Resize the image to fit the given dimensions
    }

    // Method to get the color at a given position
    getColor(x, y) {
        return this.img.get(x, y); // Get the color of the pixel at the selected coordinates
    }
}

// ArtRenderer class to handle drawing the artistic effect
class ArtRenderer {
    draw(x, y, col) {
        let length = map(saturation(col), 0, 255, 1, 40); // Map the saturation of the color to a length
        let angle = map(hue(col), 0, 255, 0, 360); // Map the hue of the color to an angle
        fill(red(col), green(col), blue(col), 127); // Set the fill color with some transparency
        noStroke(); // Disable the drawing of the outline
        push(); // Save the current drawing style and transformation
        translate(x, y); // Move the origin to (x, y)
        rotate(radians(angle)); // Rotate by the mapped angle
        rect(0, 0, length, 1); // Draw a rectangle with the mapped length
        pop(); // Restore the previous drawing style and transformation
    }
}

// FallingRect class to handle the falling rectangles
class FallingRect {
    constructor(x, y, col) {
        this.x = x;
        this.y = y;
        this.col = col;
        this.length = random(5, 20); // Random length
        this.speed = random(1, 5); // Random speed
    }

    // Method to draw the rectangle
    draw() {
        fill(this.col);
        noStroke();
        rect(this.x, this.y, this.length, this.length);
        this.y += this.speed; // Update the y position to simulate falling
    }
}

// Preload function to create an instance of ImageProcessor and load the image
function preload() {
    imgProcessor = new ImageProcessor("./monet.jpg"); // Create a new ImageProcessor instance and load the image
}

// Setup function to initialize the canvas and the image
function setup() {
    createCanvas(windowWidth, windowHeight); // Create a canvas with the same size as the window
    imgProcessor.resizeImage(width, height); // Resize the image to fit the canvas
    background(0); // Set the background to black
    artRenderer = new ArtRenderer(); // Create a new ArtRenderer instance
}

// Draw function to draw rectangles based on pixel colors
function draw() {
    if (isDrawing) {
        for (let i = 0; i < 1000; i++) {
            let x = int(random(width)); // Randomly select an x-coordinate within the canvas width
            let y = int(random(height)); // Randomly select a y-coordinate within the canvas height
            let col = imgProcessor.getColor(x, y); // Get the color at the selected coordinates using the ImageProcessor instance
            artRenderer.draw(x, y, col); // Draw a colored rectangle using the ArtRenderer instance
        }
    }

    if (isFalling) {
        if (random(1) < 0.1) { // 10% chance to create a new falling rectangle each frame
            let x = random(width);
            let col = color(random(255), random(255), random(255));
            fallingRects.push(new FallingRect(x, 0, col)); // Start at the top of the canvas
        }

        // Draw and update all falling rectangles
        for (let rect of fallingRects) {
            rect.draw();
        }

        // Remove rectangles that have fallen out of view
        fallingRects = fallingRects.filter(rect => rect.y < height);
    }
}

// MousePressed function to toggle the drawing state
function mousePressed() {
    isDrawing = !isDrawing; // Toggle the drawing state
}

// KeyPressed function to handle keyboard input
function keyPressed() {
    if (key === 'c' || key === 'C') {
        background(0); // Clear the canvas
        fallingRects = []; // Clear the falling rectangles
        isFalling = false; // Stop the falling rectangles
    } else if (key === 'a' || key === 'A') {
        isFalling = true; // Start the falling rectangles
    }
}
