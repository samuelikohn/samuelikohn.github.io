let searchbtn = document.getElementById("btnSearch");
let clearbtn = document.getElementById("btnClear");
let resultsList = document.getElementById("resultContainer").querySelector('ul');
let mydiv = document.getElementById("dropdown");
let query = document.getElementById("searchInput");

const clearsearch = () => {
    query.value = "";
    resultsList.innerHTML = ''; // Clear the list content
    mydiv.style.display = "none"; // Hide the dropdown container
};

clearbtn.addEventListener("click", clearsearch);

// Modified showResult function to append list items
const showResult = (name, img, info) => {
    // Make the container visible if it's hidden
    if (mydiv.style.display === "none" || mydiv.style.display === "") {
        mydiv.style.display = "block";
    }

    // Create a new list item element
    const listItem = document.createElement('li');

    // Set the inner HTML of the list item
    // Added quotes around src attribute value for correctness
    listItem.innerHTML = `
        <h2 class="title">${name}</h2>
        <img class="search-img" src="${img}" alt="${name}"> 
        <p class="description">${info}</p>
    `;

    // Append the new list item to the results list (the UL)
    resultsList.appendChild(listItem);
};

// Modified searchError function
const searchError = () => {
    // Make the container visible if it's hidden
    if (mydiv.style.display === "none" || mydiv.style.display === "") {
        mydiv.style.display = "block";
    }
    // Display error message inside the list
    // You might want to wrap this in an <li> as well for consistency
    resultsList.innerHTML = `<li class="notfound">Sorry, we couldn't find any recommendations matching your search.</li>`;
};

fetch("travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
        const search = () => {
            // 1. Clear previous results from the list FIRST
            resultsList.innerHTML = '';
            // 2. Hide the dropdown initially (it will be shown if results are found)
            mydiv.style.display = "none";

            let searchQuery = query.value.trim().toLowerCase(); // Trim whitespace and convert to lower case
            let notfound = true;

            // Check if search query is empty
            if (!searchQuery) {
                // Optionally show a message or just do nothing
                // searchError("Please enter a search term."); // Example modification
                return; // Exit if search is empty
            }

            // Simplified search keywords
            const keywords = {
                countries: ["country", "countries"],
                temples: ["temple", "temples"],
                beaches: ["beach", "beaches"]
            };

            // Search Countries/Cities
            data.countries.forEach((country) => {
                // Check if the search query matches the general 'country' keyword or the specific country name
                if (keywords.countries.includes(searchQuery) || country.name.toLowerCase().includes(searchQuery)) {
                    country.cities.forEach((city) => {
                        showResult(city.name, city.imageUrl, city.description);
                        notfound = false;
                    });
                } else {
                    // Otherwise, check individual cities within this country
                    country.cities.forEach((city) => {
                        if (city.name.toLowerCase().includes(searchQuery) || city.description.toLowerCase().includes(searchQuery)) {
                            showResult(city.name, city.imageUrl, city.description);
                            notfound = false;
                        }
                    });
                }
            });

            // Search Temples
            data.temples.forEach((temple) => {
                if (keywords.temples.includes(searchQuery) || temple.name.toLowerCase().includes(searchQuery) || temple.description.toLowerCase().includes(searchQuery)) {
                    showResult(temple.name, temple.imageUrl, temple.description);
                    notfound = false;
                }
            });

            // Search Beaches
            data.beaches.forEach((beach) => {
                if (keywords.beaches.includes(searchQuery) || beach.name.toLowerCase().includes(searchQuery) || beach.description.toLowerCase().includes(searchQuery)) {
                    showResult(beach.name, beach.imageUrl, beach.description);
                    notfound = false;
                }
            });


            // If no results were found after checking everything
            if (notfound) {
                searchError();
            }
        };

        searchbtn.addEventListener("click", search);
        // Optional: Allow searching on pressing Enter in the input field
        query.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault(); // Prevent default form submission if it were in a form
              search();
            }
          });
    })
    .catch(error => {
        console.error("Error fetching recommendation data:", error);
        // Optionally display an error to the user in the results area
        resultsList.innerHTML = `<li class="error">Could not load recommendation data. Please try again later.</li>`;
        mydiv.style.display = "block";
    });


function thankyou(){
    alert('Thank you for contacting us!')
}
