const colorScraperBtn = document.querySelector(".color-scraper");
const pickedColors = document.querySelector(".all-colors");
const clearAllBtn = document.querySelector(".clear-all");

const activateEyeDropper = async () => {
    try {
        const eyeDropper = new EyeDropper();
        const response = await eyeDropper.open();

        // Convert the color to uppercase
        const colorHex = response.sRGBHex.toUpperCase();

        const allColorsList = document.querySelector(".all-colors");
        const existingColors = Array.from(allColorsList.querySelectorAll(".value")).map(
            (valueSpan) => valueSpan.textContent
        );
        
        // Check if the color already exists in the list
        if (existingColors.includes(colorHex)) {
            // Find the existing color element
            const existingColorElement = Array.from(allColorsList.querySelectorAll(".value")).find(
                (valueSpan) => valueSpan.textContent === colorHex
            );

            highlightDuplicateColor(existingColorElement, colorHex);
            return;
        }
        
        // Copy the color to the clipboard
        await navigator.clipboard.writeText(colorHex);

        // Remove the hide class to show the picked colors section
        document.querySelector(".picked-colors").classList.remove("hide");

        // Create a new list item for the picked color
        const newColor = document.createElement("li");
        newColor.classList.add("color");
        
        const colorRect = document.createElement("span");
        colorRect.classList.add("rect");
        colorRect.style.backgroundColor = colorHex;  // Set background to picked color
        
        const colorValue = document.createElement("span");
        colorValue.classList.add("value");
        colorValue.textContent = colorHex;  // Show color value

        newColor.appendChild(colorRect);
        newColor.appendChild(colorValue);
        
        // Add click event to copy color when clicked
        newColor.addEventListener("click", () => copyColorToClipboard(colorValue, colorHex));

        pickedColors.appendChild(newColor);  // Append new color to the list
    } catch (error){
        console.log(error);
    }
}

const copyColorToClipboard = async (colorElement, color) => {
    try {
        const uppercaseColor = color.toUpperCase();
        await navigator.clipboard.writeText(uppercaseColor);
        
        // Update the DOM element's text to "Copied"
        const originalText = colorElement.innerHTML;
        colorElement.innerHTML = "Copied!";

        // Revert back to the original color value after 0.5 second
        setTimeout(() => {
            colorElement.innerHTML = originalText;
        }, 500);
    } catch (error) {
        console.error("Failed to copy color:", error);
    }
};

clearAllBtn.addEventListener("click", () => {
    pickedColors.innerHTML = "";  // Remove all color list items
    // Hide the picked colors section again
    document.querySelector(".picked-colors").classList.add("hide");
});

colorScraperBtn.addEventListener("click", activateEyeDropper);
// Event listener for keyboard shortcut (P key)
document.addEventListener("keydown", (event) => {
    if (event.key === "p" || event.key === "P") {
        activateEyeDropper(); // Trigger the color picker function
    }
});


const highlightDuplicateColor = (existingColorElement, originalColor) => {
    // Set the original color as an inline style for the animation
    existingColorElement.parentElement.style.setProperty("--original-color", originalColor);

    // Add the highlight class
    existingColorElement.parentElement.classList.remove("highlight");

    // Use a short timeout to re-add the class and retrigger the animation
    setTimeout(() => {
        existingColorElement.parentElement.classList.add("highlight");
    }, 10); // Small delay to ensure the class is re-applied
};
