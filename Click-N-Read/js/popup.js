// Theme switch.
const body = document.body;

// Initial theme based on user preference
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  body.classList.add("dark");
} else {
  body.classList.add("light");
}

//Theme Thing:
document.addEventListener("DOMContentLoaded", () => {
  const styleSelect = document.getElementById("style-select");

  // Load the saved style from the cookie(if available)
  const savedStyle = getCookie("selectedStyle");
  if (savedStyle && styleSelect) {
    styleSelect.value = savedStyle;
    toggleStyles(savedStyle);
  }

  // Toggle styles based on the user's choice
  styleSelect.addEventListener("change", (event) => {
    const selectedStyle = event.target.value;
    toggleStyles(selectedStyle);
    setCookie("selectedStyle", selectedStyle, 7);
    // Cookie Expire in 7 days.
  });
});

function toggleStyles(style) {
  const styles = ["style1", "style2", "style3", "style4", "style5"];
  for (const s of styles) {
    const styleElement = document.getElementById(s);
    if (styleElement) {
      styleElement.disabled = true;
    }
  }

  const selectedStyle = document.getElementById(style);
  if (selectedStyle) {
    selectedStyle.disabled = false;
  }
}

// Set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Cookie value
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return null;
}

// Like Button:
const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach((likeButton, index) => {
  let isLiked = false;

  function toggleLike() {
    isLiked = !isLiked;

    if (isLiked) {
      likeButton.innerHTML = "❤️";
      likeButton.classList.add("liked");
    } else {
      likeButton.innerHTML = "🤍";
      likeButton.classList.remove("liked");
    }
  }

  likeButton.addEventListener("click", toggleLike);
});

// Share Button.
const promotionalLink = "https://qjfextension.blogspot.com"; // Blog-Site link

function shareContent(contentId, contentTitle) {
  const title = document.title;
  const contentText = document.getElementById(contentId).innerText;
  const text = `" ${contentText} "\n\n\nTurn your boring loading screens into fun and inspiring moments with Quotes, Facts & Jokes Extension:\n\n${promotionalLink}`;

  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: text,
      })
      .then(() => console.log("Share successful"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    const copyText = `${contentText}\n\nPromotional content:\n${promotionalLink}`;

    navigator.clipboard
      .writeText(copyText)
      .then(() => alert("Copied content to clipboard. Paste it where needed!"))
      .catch((error) => console.error("Copy failed:", error));
  }
}

// Save Button:

// Function to save content to localStorage and cookies
function saveContent(section, content) {
  let savedContent = JSON.parse(localStorage.getItem("savedContent")) || {};

  if (!savedContent[section]) {
    savedContent[section] = [];
  }

  savedContent[section].push(content);
  localStorage.setItem("savedContent", JSON.stringify(savedContent));

  // Set cookies for persistence
  document.cookie = `savedContent=${encodeURIComponent(
    JSON.stringify(savedContent)
  )}`;
}

// Retrieve saved content from cookies on page load
window.onload = function () {
  const cookies = decodeURIComponent(document.cookie).split(";");
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    if (name.trim() === "savedContent") {
      try {
        const savedContent = JSON.parse(value);
        console.log("Retrieved content from cookies:", savedContent);
      } catch (error) {
        console.error("Error parsing JSON from cookie:", error);
        // You may choose to handle the error in a way that makes sense for your application
      }
    }
  });
};

// Display saved content for a section
function displaySavedContent(section) {
  const savedContent = JSON.parse(localStorage.getItem("savedContent"));

  if (savedContent && savedContent[section]) {
    // return savedContent[section].join("\n");
    const contentWithDots = savedContent[section].map(
      (item, index) => `${index + 1}. ${item}`
    );
    return contentWithDots.join("</br>");
  } else {
    return `No saved ${section} content available.`;
  }
}

// Function to clear saved data
function clearSavedData() {
  localStorage.removeItem("savedContent");
  document.cookie = "savedContent=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.getElementById("savedContent").innerHTML = "";
}

// Event listeners for Save buttons

// Event listener for the button to display saved content
document
  .getElementById("displaySavedContentButton")
  .addEventListener("click", function () {
    const dialog = document.getElementById("dialog");
    const contentElement = document.getElementById("savedContent");
    contentElement.innerHTML = `
        <h3 class="content">Quote</h3>
        <p>${displaySavedContent("quotes")}</p>
        <h3 class="content">Facts</h3>
        <p>${displaySavedContent("facts")}</p>
        <h3 class="content">Jokes</h3>
        <p>${displaySavedContent("jokes")}</p>
    `;
    dialog.style.display = "block";
  });

document
  .getElementById("clearSavedDataButton")
  .addEventListener("click", function () {
    clearSavedData();
  });

document.getElementById("closeBtn").addEventListener("click", () => {
  document.getElementById("dialog").style.display = "none";
});

// Greeting With Names:

function greetUser() {
  let name = getCookie("userName");
  let greeting = "";
  let currentDate = new Date();
  let currentHour = currentDate.getHours();

  document.getElementById("changeName").addEventListener("click", function () {
    document.cookie =
      "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
  });

  if (!name) {
    name = prompt("Please enter your name:");
    if (name) {
      // Set the expiration time to 30 days from now
      document.cookie =
        "userName=" +
        name +
        ";expires=" +
        new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    }
  }

  let greetedMorning = getCookie("morningGreeted");
  let greetedOnce = getCookie("greetedOnce");

  if (name) {
    if (greetedMorning && !greetedOnce) {
      greeting = "Welcome back, " + name + "!";
      document.cookie =
        "greetedOnce=true;expires=" +
        new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    } else {
      greeting = "Good ";
      if (currentHour < 12) {
        greeting += "morning, " + name + "!";
        document.cookie =
          "morningGreeted=true;expires=" +
          new Date(
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000
          ).toUTCString();
      } else if (currentHour < 18) {
        greeting += "afternoon, " + name + "!";
      } else {
        greeting += "evening, " + name + "!";
      }
    }

    document.getElementById("greetingDiv").textContent = greeting;
  }
}

function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

greetUser();

// Content:

// Note:
    // This are the offline content which will we displayed when internet is not available.
//   Quotes:
const quotes = [
  "The only way to do great work is to love what you do. \n \n - Steve Jobs",
  "Life is 10% what happens to us and 90% how we react to it.\n \n - Charles R. Swindoll",
  "The only limit to our realization of tomorrow will be our doubts of today.\n \n - Franklin D. Roosevelt",
  "It does not matter how slowly you go as long as you do not stop.\n \n - Confucius",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.\n \n - Winston S. Churchill",
  "The road to success and the road to failure are almost exactly the same.\n \n  - Colin R. Davis",
  "I find that the harder I work, the more luck I seem to have.\n \n  - Thomas Jefferson",
  "Success is walking from failure to failure with no loss of enthusiasm.\n \n  - Winston S. Churchill",
  "Believe you can and you're halfway there.\n \n  - Theodore Roosevelt",
  "The secret of getting ahead is getting started.\n \n  - Mark Twain",
  "Opportunities don't happen. You create them.\n \n  - Chris Grosser",
  "Don't be afraid to give up the good to go for the great.\n \n  - John D. Rockefeller",
  "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.\n \n  - Jimmy Dean",
  "The only thing that stands between you and your dream is the will to try and the belief that it is actually possible.\n \n  - Joel Brown",
  "Success is not in what you have, but who you are.\n \n  - Bo Bennett",
  "The best revenge is massive success.\n \n  - Frank Sinatra",
  "Don't watch the clock; do what it does. Keep going.\n \n  - Sam Levenson",
  "You are never too old to set another goal or to dream a new dream.\n \n  - C.S. Lewis",
  "The future belongs to those who believe in the beauty of their dreams.\n \n  - Eleanor Roosevelt",
  "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.\n \n  - Jordan Belfort",
  "The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.\n \n  - Mark Zuckerberg",
  "The only place where success comes before work is in the dictionary.\n \n  - Vidal Sassoon",
  "Success is stumbling from failure to failure with no loss of enthusiasm.\n \n  - Winston S. Churchill",
  "I find that when you have a real interest in life and a curious life, that sleep is not the most important thing.\n \n  - Martha Stewart",
  "The only thing that I have done that is not mitigated by luck, diminished by good fortune, is that I persisted, and other people gave up.\n \n  - Harrison Ford",
  "In the middle of every difficulty lies opportunity.\n\n - Albert Einstein",
  "The only way to do great work is to love what you do.\n\n - Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.\n\n - Winston Churchill",
  "Don't watch the clock; do what it does. Keep going.\n\n - Sam Levenson",
  "The only limit to our realization of tomorrow will be our doubts of today.\n\n - Franklin D. Roosevelt",
  "Your time is limited, so don't waste it living someone else's life.\n\n - Steve Jobs",
  "Believe you can and you're halfway there.\n\n - Theodore Roosevelt",
  "Success is stumbling from failure to failure with no loss of enthusiasm.\n\n - Winston S. Churchill",
  "Do not wait to strike till the iron is hot, but make it hot by striking.\n\n - William Butler Yeats",
  "The way to get started is to quit talking and begin doing.\n\n - Walt Disney",
  "I find that the harder I work, the more luck I seem to have.\n\n - Thomas Jefferson",
  "The only place where success comes before work is in the dictionary.\n\n - Vidal Sassoon",
  "It's not whether you get knocked down, it's whether you get up.\n\n - Vince Lombardi",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.\n\n - Zig Ziglar",
  "The future belongs to those who believe in the beauty of their dreams.\n\n - Eleanor Roosevelt",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.\n\n - Steve Jobs",
  "Opportunities don't happen. You create them.\n\n - Chris Grosser",
];

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

const blqu = document.getElementById("block-1");
const butt = document.getElementById("next");

function fetchQuote(div) {
  fetch("https://api.quotable.io/random")
    .then((response) => response.json())
    .then((jsonData) => {
      div.innerHTML = "";

      const quotetext = document.createElement("p");
      quotetext.textContent = jsonData.content;

      const authortext = document.createElement("p");
      authortext.textContent = `-${jsonData.author}`;

      div.appendChild(quotetext);
      div.appendChild(authortext);
    })
    .catch((error) => {
      console.error("Error fetching quote: ", error);
      // console.log(error, "Fuck you error!")
      div.innerText = getRandomQuote();
    });

  // document.getElementById("likeButton1").innerHTML = "🤍";
}

// butt.addEventListener("click", fetchQuote);

fetchQuote(blqu);

// Facts:
const facts = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "The Eiffel Tower can be 15 cm taller during the summer due to the expansion of the iron structure from the heat.",
  "Octopuses have three hearts. Two pump blood to the gills, and one pumps it to the rest of the body.",
  "Bananas are berries, but strawberries aren't.",
  "A group of flamingos is called a 'flamboyance.'",
  "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
  "Cows have best friends and can become stressed when separated from them.",
  "The unicorn is Scotland's national animal.",
  "The Great Wall of China is not visible from space without aid, such as binoculars or a telescope.",
  "The longest hiccuping spree lasted for 68 years.",
  "Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramid of Giza.",
  "The world's largest desert is not the Sahara but Antarctica.",
  "In Switzerland, it's illegal to own just one guinea pig because they are prone to loneliness.",
  "There are more possible iterations of a game of chess than there are atoms in the known universe.",
  "Polar bears have black skin and translucent fur.",
  "A day on Venus is longer than its year.",
  "The largest volcano in the solar system is on Mars and is called Olympus Mons.",
  "The dot over the lowercase 'i' or 'j' is called a tittle.",
  "The longest word in the English language without a vowel is 'rhythms.'",
  "The strongest muscle in the human body is the masseter (jaw muscle).",
  "A group of pandas is called an embarrassment.",
  "The oldest known sample of the smallpox virus was found in the teeth of a 17th-century child buried in Lithuania.",
  "Wombat feces are cube-shaped.",
  "A single strand of spaghetti is called a 'spaghetto.'",
  "The average person spends six months of their lifetime waiting for red lights to turn green.",
  "The total weight of all the ants on Earth is comparable to, if not greater than, the total weight of all the humans on Earth.",
  "The longest time between two twins being born is 87 days.",
  "An octopus has three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
  "There are more possible iterations of a game of chess than there are atoms in the known universe.",
  "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
  "Cows have best friends and can become stressed when separated from them.",
  "The unicorn is Scotland's national animal.",
  "Bananas are berries, but strawberries aren't.",
  "Octopuses have three hearts. Two pump blood to the gills, and one pumps it to the rest of the body.",
  "The Eiffel Tower can be 15 cm taller during the summer due to the expansion of the iron structure from the heat.",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "The total weight of all the ants on Earth is comparable to, if not greater than, the total weight of all the humans on Earth.",
  "Wombat feces are cube-shaped.",
  "The oldest known sample of the smallpox virus was found in the teeth of a 17th-century child buried in Lithuania.",
  "A group of pandas is called an embarrassment.",
  "The strongest muscle in the human body is the masseter (jaw muscle).",
  "The dot over the lowercase 'i' or 'j' is called a tittle.",
  "The longest word in the English language without a vowel is 'rhythms.'",
  "A day on Venus is longer than its year.",
  "The largest volcano in the solar system is on Mars and is called Olympus Mons.",
  "Polar bears have black skin and translucent fur.",
  "The longest hiccuping spree lasted for 68 years.",
  "Cleopatra lived closer in time to the moon landing than to the construction of the Great Pyramid of Giza.",
  "The world's largest desert is not the Sahara but Antarctica.",
  "In Switzerland, it's illegal to own just one guinea pig because they are prone to loneliness.",
  "There are more possible iterations of a game of chess than there are atoms in the known universe.",
  "The oldest known sample of the smallpox virus was found in the teeth of a 17th-century child buried in Lithuania.",
  "Wombat feces are cube-shaped.",
];

// Function to get a random fact
function getRandomFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  return facts[randomIndex];
}

const factcont = document.getElementById("block-2");
const nxbtn = document.getElementById("next-2");

function fetchFact(div) {
  fetch("https://useless-facts.sameerkumar.website/api")
    .then((response) => response.json())
    .then((jsonData) => {
      div.innerHTML = "";

      const factText = jsonData.data;

      const factpara = document.createElement("p");
      div.textContent = factText;

      factcont.appendChild(factpara);
    })
    .catch((error) => {
      console.error("Erro fecthing data: ", error);
      div.innerText = getRandomFact();
    });

  // document.getElementById("likeButton2").innerHTML = "🤍";
}

// nxbtn.addEventListener("click", fetchFact);

fetchFact(factcont);

// Jokes:
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "I'm reading a book on anti-gravity. It's impossible to put down!",
  "What did one wall say to the other wall? I'll meet you at the corner!",
  "I used to play piano by ear, but now I use my hands.",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What did one hat say to the other hat? You stay here; I'll go on ahead!",
  "How does a penguin build its house? Igloos it together!",
  "I'm on a seafood diet. I see food, and I eat it!",
  "Why don't oysters donate to charity? Because they are shellfish!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I used to be a baker, but I couldn't make enough dough.",
  "I'm friends with all electricians. We have such great current connections.",
  "What do you get when you cross a snowman and a vampire? Frostbite!",
  "I used to be a shoe salesman, but I lost my sole.",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "I used to be a baker, but I couldn't make enough dough.",
  "What did one ocean say to the other ocean? Nothing, they just waved.",
  "I'm friends with all electricians. We have such great current connections.",
  "I'm reading a book on anti-gravity. It's impossible to put down!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "I'm on a seafood diet. I see food, and I eat it!",
];

// Function to get a random joke
function getRandomJoke() {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}

const jokecon = document.getElementById("block-3");
const btnx = document.getElementById("next-3");

function fetchJoke(div) {
  // Fetching data from the API
  fetch("https://official-joke-api.appspot.com/random_joke")
    .then((response) => response.json())
    .then((jsonData) => {
      // Clear existing content
      div.innerHTML = "";

      // Creating HTML elements to display the joke
      const setupElement = document.createElement("p");
      setupElement.textContent = jsonData.setup;

      const punchlineElement = document.createElement("p");
      punchlineElement.textContent = jsonData.punchline;

      // Appending elements to the container
      div.appendChild(setupElement);
      div.appendChild(punchlineElement);
    })
    .catch((error) => {
      console.error("Error fetching joke:", error);
      div.innerText = getRandomJoke();
    });

  // document.getElementById("likeButton3").innerHTML = "🤍";
}

// btnx.addEventListener("click", fetchJoke);

fetchJoke(jokecon);

// tooltips:
const about = document.getElementById("about");
about.setAttribute("title", "Learn more about this Extension's features.");
const submit = document.getElementById("submit");
submit.setAttribute("title", "Contribute your own quotes, facts, and jokes!");
const Feedback = document.getElementById("Feedback");
Feedback.setAttribute(
  "title",
  "Help us improve! Share your valuable feedback here."
);
const memes = document.getElementById("Memes");
Feedback.setAttribute(
  "title", "Indulge in the timeless joy of memes at Kissu Memes! Your daily sanctuary for laughter and humor. Dive into a world where every scroll brings a smile. Join the mirthful journey – Because life's better with a touch of memes! #KissuMemes"
)

Test = document.getElementById("testing");
Test_Heading = document.getElementById("Test-Heading");
Test_Content = document.getElementById("contenthere");

var number = Math.floor(Math.random() * 3);

function GenrateContent(number) {
  console.log(number);
  switch (number) {
    case 0:
      Test_Heading.innerText = "Quote.";
      fetchQuote(Test_Content);
      break;
    case 1:
      Test_Heading.innerText = "Fact.";
      fetchFact(Test_Content);
      break;
    case 2:
      Test_Heading.innerText = "Joke.";
      fetchJoke(Test_Content);
      break;
  }
  document.getElementById("likebutton4").innerHTML = "🤍";
}
GenrateContent(number);

// Function to update the value of 'number' with a new random number
function updateNumber() {
  number = Math.floor(Math.random() * 3);
  console.log("Updated number:", number);
  return number;
}

const shareButton3 = document.getElementById("shareButton-4");
shareButton3.addEventListener("click", () => {
  shareContent("contenthere", "Random");
});

const next4 = document.getElementById("next-4");

function next_Random() {
  GenrateContent(updateNumber());
}

next4.addEventListener("click", function () {
  var selectedOption = document.getElementById("numberSelect").value;
  var resultDiv = document.getElementById("result");

  // Call the appropriate function based on the selected option
  switch (selectedOption) {
    case "1":
      console.log("Performing action for Option 1");
      GenrateContent(next_Random());
      break;
    case "2":
      console.log("Performing action for Option 2");
      GenrateContent(0);
      break;
    case "3":
      console.log("Performing action for Option 3");
      GenrateContent(1);
      break;
    case "4":
      console.log("Performing action for Option 4");
      GenrateContent(2);
      break;
    default:
      alert("Select a valid option.");
  }
});



document.getElementById("numberSelect").addEventListener("change", function () {
  var selectedOption = this.value;
  var resultDiv = document.getElementById("result");

  // Call the appropriate function based on the selected option
  switch (selectedOption) {
    case "1":
      // resultDiv.textContent = option1Function();
      GenrateContent(number);
      break;
    case "2":
      // resultDiv.textContent = option2Function();
      GenrateContent(0);
      break;
    case "3":
      // resultDiv.textContent = option3Function();
      GenrateContent(1);
      break;
    case "4":
      // resultDiv.textContent = option4Function();
      GenrateContent(2);
      break;
    default:
      resultDiv.textContent = "Select a valid option.";
  }

  // Set a cookie with the selected option that expires in 7 days
  setCookie("selectedOption", selectedOption, 7);
});

// Function to set a cookie with an expiration date
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Function to get a cookie by name
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// When the page loads, check if there's a stored option and set it in the dropdown
document.addEventListener("DOMContentLoaded", function () {
  var storedOption = getCookie("selectedOption");
  if (storedOption) {
    document.getElementById("numberSelect").value = storedOption;
    // Trigger the change event to update the result and store the cookie again
    document.getElementById("numberSelect").dispatchEvent(new Event("change"));
  }
});

// Function to save in Random option selected:
function SaveRandom (number) {
  switch (number) {
    case "0":
      saveContent("quotes", Content);
      break;
    case "1":
      saveContent("facts", Content);
      break;
    case "2":
      saveContent("jokes", Content);
      break;
  }
}

// Save Button Things:
save_button_4 = document.getElementById("saveButton-4");
save_button_4.addEventListener("click", function () {
  var selectedOption = document.getElementById("numberSelect").value;
  const Content = document.getElementById("contenthere").textContent;
  const numb = number

  switch ((selectedOption)) {
    case "1":
      // console.log("It's option Random.");
      alert("This Feature is not available for Random Option.")
      break;
    case "2":
      console.log("It's Quote Section.");
      saveContent("quotes", Content);
      break;
    case "3":
      console.log("It's Facts Section.");
      saveContent("facts", Content);
      break;
    case "4":
      console.log("It's Joke Section.");
      saveContent("jokes", Content);
      break;
    default:
      alert("You're Wrong.");
  }
});


// Upcoming Features:
//  - Share & Copy function in Saved section.
//  - Some UI changes in extension.
//    - Like in Facts Container:
//        -- > Title like Did You know or something like that.
//        -- > Reaction pannel for Jokes.   [Not just for jokes but for all(if possible.)]
//  - Catogery in quotes. [Try changing the API for this feature.]

//  - Aatla to kar gawar, pachi joje aagal nu.

// Next Update Info:
//  - News API & Instans news things. [API & it's is almost arranges.]
//  - Quiz & some personality thing.
//    - Maths or personality related things.  [Like personality quiz or research for it.]
//      -- > Like from name or from req some insides if possible.
//          [ Complicated idea impliment this only if you're confident Kissu. (Cuz you're not that talented.) 🥲 ]
//  - Interective Game section.
//    - On local page just like popup.html. Game section with some imgs.
//    - Games like: Tic-Tac-Toe, Sudoku, Stone-paper-scissors, HangMan, Memory-Match, Ping-Pong, Simon (Sequnce repeater), World Puzzle, Snake & apple.
//                (Any three at first place.)
//                ( Create lvls if possible like easy, medium & hard.)


console.log("It's working.");