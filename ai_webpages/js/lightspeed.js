let stars = [];
    let numStars = 1000;
    let speedFraction = 0;  // Fraction of speed of light
    let speedSliderElement;
    let starsSliderElement;
    let speedDisplayElement;
    let starsDisplayElement;
    let optimizeCheckbox;
    let fpsCounter;
    let frameRateHistory = [];
    let lastFrameTime = 0;
    let useOptimizations = true;
    
    function setup() {
      const canvas = createCanvas(800, 500);
      canvas.parent('canvas-container');
      
      generateStars(numStars);
      
      // Set up the speed slider
      speedSliderElement = document.getElementById('speed-slider');
      speedDisplayElement = document.getElementById('speed-display');
      
      speedSliderElement.addEventListener('input', function() {
        speedFraction = parseFloat(this.value);
        updateSpeedDisplay();
      });
      
      // Set up the stars slider
      starsSliderElement = document.getElementById('stars-slider');
      starsDisplayElement = document.getElementById('stars-display');
      
      starsSliderElement.addEventListener('input', function() {
        numStars = parseInt(this.value);
        updateStarsDisplay();
        generateStars(numStars);
      });
      
      // Set up performance mode checkbox
      optimizeCheckbox = document.getElementById('optimize-checkbox');
      optimizeCheckbox.addEventListener('change', function() {
        useOptimizations = this.checked;
      });
      
      // Set up FPS counter
      fpsCounter = document.getElementById('fps-counter');
      
      updateSpeedDisplay();
      updateStarsDisplay();
    }
    
    function generateStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        // Place stars in a 3D space, with z extending away from viewer
        stars.push({
          x: random(-width/2, width/2),
          y: random(-height/2, height/2),
          z: random(50, 2000),
          size: random(1, 3),
          color: color(
            random(200, 255),
            random(200, 255),
            random(200, 255)
          ),
          // Pre-compute some values that don't change
          originalColor: [random(200, 255), random(200, 255), random(200, 255)]
        });
      }
    }
    
    function updateSpeedDisplay() {
      speedDisplayElement.textContent = speedFraction.toFixed(4) + " c";
    }
    
    function updateStarsDisplay() {
      starsDisplayElement.textContent = numStars;
    }
    
    function updateFPSCounter() {
      const now = millis();
      const deltaTime = now - lastFrameTime;
      lastFrameTime = now;
      
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        frameRateHistory.push(currentFPS);
        
        // Keep only the last 10 frames for average calculation
        if (frameRateHistory.length > 10) {
          frameRateHistory.shift();
        }
        
        // Calculate average FPS
        const avgFPS = frameRateHistory.reduce((sum, fps) => sum + fps, 0) / frameRateHistory.length;
        fpsCounter.textContent = `FPS: ${Math.round(avgFPS)}`;
      }
    }
    
    function draw() {
      background(10, 10, 22);
      
      // Update FPS counter
      updateFPSCounter();
      
      // Move to center of canvas
      translate(width/2, height/2);
      
      // Calculate relativistic effects
      const gamma = 1 / Math.sqrt(1 - speedFraction * speedFraction);
      const lorentzFactor = gamma;
      
      // Determine sampling rate based on optimization settings and speed
      let samplingRate = 1;
      if (useOptimizations) {
        if (speedFraction > 0.99) {
          samplingRate = 3; // Skip more stars at very high speeds
        } else if (speedFraction > 0.9) {
          samplingRate = 2; // Skip every other star at high speeds
        }
      }
      
      // Pre-calculate doppler values
      let dopplerFactor = 1;
      if (speedFraction > 0) {
        dopplerFactor = Math.sqrt((1 + speedFraction) / (1 - speedFraction));
      }
      
      // Draw and update stars
      for (let i = 0; i < stars.length; i += samplingRate) {
        const star = stars[i];
        
        // Apply relativistic effects
        
        // Length contraction in direction of movement (z-axis)
        const contractedZ = star.z / lorentzFactor;
        
        // Skip detailed calculations for very distant stars when optimizing
        if (useOptimizations && contractedZ > 1500) {
          continue;
        }
        
        // Only do the expensive calculations if in front of viewer
        if (contractedZ > 0) {
          // Simplified aberration calculation
          let aberrationFactor = 1;
          if (speedFraction > 0.1) { // Only calculate for significant speeds
            const denom = Math.sqrt(star.x * star.x + star.y * star.y + contractedZ * contractedZ);
            if (denom > 0) { // Avoid division by zero
              aberrationFactor = (1 - speedFraction) / (1 - speedFraction * (contractedZ / denom));
            }
          }
          
          // Calculate perspective
          const perspective = 400 / contractedZ;
          const projectedX = star.x * perspective * aberrationFactor;
          const projectedY = star.y * perspective * aberrationFactor;
          
          // Only draw if within canvas bounds (optimization)
          if (projectedX >= -width/2 && projectedX <= width/2 && 
              projectedY >= -height/2 && projectedY <= height/2) {
            
            // Doppler effect (blueshift in front, redshift behind)
            // Use pre-computed original color values
            let r = constrain(star.originalColor[0] * (1/dopplerFactor), 0, 255);
            let g = constrain(star.originalColor[1], 0, 255);
            let b = constrain(star.originalColor[2] * dopplerFactor, 0, 255);
            
            // Brightness increases with speed due to relativistic headlight effect
            const brightness = map(speedFraction, 0, 1, 1, 5);
            const alpha = 255 * constrain(brightness / (contractedZ/100), 0, 1);
            
            // Draw the star
            fill(r, g, b, alpha);
            noStroke();
            
            // Size depends on distance and relativistic effects
            const displaySize = star.size * perspective * 
                              constrain(map(speedFraction, 0, 1, 1, 3), 1, 5);
            
            ellipse(projectedX, projectedY, displaySize, displaySize);
          }
        }
        
        // Move stars in z-direction based on speed
        // Use adaptive step size for smoother motion at high speeds
        const stepSize = speedFraction * (useOptimizations ? 50 * (1 + speedFraction * 2) : 50);
        star.z -= stepSize;
        
        // If a star goes behind the viewer, reposition it far ahead
        if (star.z <= 0) {
          star.z = random(1500, 2000);
          star.x = random(-width/2, width/2);
          star.y = random(-height/2, height/2);
        }
      }
      
      // Add visual light speed indicator
      if (speedFraction > 0) {
        // Only add shadow effects if not in performance mode or at low speeds
        if (!useOptimizations || speedFraction < 0.5) {
          // Light cone effect around the edges
          const coneIntensity = map(speedFraction, 0, 1, 0, 100);
          drawingContext.shadowBlur = coneIntensity;
          drawingContext.shadowColor = color(100, 150, 255, coneIntensity);
        }
        
        // Time dilation indicator
        fill(255);
        textSize(16);
        textAlign(LEFT, TOP);
        text("Time Dilation: " + lorentzFactor.toFixed(2) + "x", -width/2 + 20, -height/2 + 20);
      }
    }
  