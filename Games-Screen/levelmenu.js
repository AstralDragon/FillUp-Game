document.addEventListener("DOMContentLoaded", function () {

  // causing grid to disappear
  const gridContainer = document.querySelector(".grid-container");

  // Create 30 grid items
  for (let i = 0; i < 30; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item", "locked");

    const availability = document.createElement("div");
    availability.classList.add("availability");

    const lockIcon = document.createElement("span");
    lockIcon.classList.add("lock-icon");
    const lockImg = document.createElement("img");
    lockImg.src = "../images/lock.svg";
    lockImg.alt = "";
    lockIcon.appendChild(lockImg);

    availability.appendChild(lockIcon);
    gridItem.appendChild(availability);

    gridContainer.appendChild(gridItem);
  }
  // -----------------------------------------------------------------

  // Add click event listener to each grid item
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("locked")) {
        // Level is unlocked, perform action (e.g., load level)
        console.log(`Clicked on level ${index + 1}`);

        // Replace lock with level number
        const availability = item.querySelector(".availability");
        availability.innerHTML = index + 1;
        availability.style.fontSize = "24px"; // Adjust font size as needed
        availability.style.color = "#333"; // Adjust text color
        availability.style.fontWeight = "bold"; // Adjust font weight if necessary
        availability.style.display = "flex";
        availability.style.justifyContent = "center";
        availability.style.alignItems = "center";

        // Example: Hide lock icon when level is unlocked
        const lockIcon = item.querySelector(".lock-icon");
        if (lockIcon) {
          lockIcon.style.display = "none";
        }

        // Example: Load level or perform action
        // window.location.href = `level${index + 1}.html`;
      } else {
        // Level is locked, display message or handle accordingly
        console.log(`Level ${index + 1} is locked`);
        // Example: Show a message or animation
      }
    });
  });

  // Example: Simulate unlocking a level after 3 seconds (for demonstration)
  setTimeout(() => {
    gridItems[0].classList.remove("locked");
    const lockIcon = gridItems[0].querySelector(".lock-icon");
    if (lockIcon) {
      lockIcon.style.display = "none"; // Hide lock icon
    }
  }, 3000); // Adjust timing as needed
});
