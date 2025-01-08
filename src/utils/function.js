export function jwtExpiryToMilliseconds(expiry) {
    // Conversion factors to milliseconds
    const timeUnits = {
      s: 1000,                 // Seconds 
      m: 60 * 1000,            // Minutes 
      h: 60 * 60 * 1000,       // Hours 
      d: 24 * 60 * 60 * 1000,  // Days 
      w: 7 * 24 * 60 * 60 * 1000,  // Weeks 
      y: 365 * 24 * 60 * 60 * 1000 // Years 
    };
  
    // Use regex to extract numeric value and time unit
    const match = expiry.match(/^(\d+)([smhdy])$/);
    if (!match) {
      throw new Error("Invalid expiry format. Use a format like '15d', '15m', etc.");
    }
  
    const [_, value, unit] = match;
    const numericValue = parseInt(value, 10);
  
    // Validate unit and calculate milliseconds
    if (!timeUnits[unit]) {
      throw new Error(`Invalid time unit '${unit}'. Use one of: ${Object.keys(timeUnits).join(", ")}`);
    }
  
    return numericValue * timeUnits[unit];
  }
  
  
  