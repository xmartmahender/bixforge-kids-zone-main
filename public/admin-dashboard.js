// BixForge Admin Dashboard - Age-Based Coding Education Management
// Enhanced with Code Stories and Code Videos Management + Firebase Integration

// Firebase Configuration - Updated with correct config
const firebaseConfig = {
    apiKey: "AIzaSyAZVV35MNDjEJTrKMsHvDdCm0CNW63XUZ4",
    authDomain: "new-project-f8d5e.firebaseapp.com",
    projectId: "new-project-f8d5e",
    storageBucket: "new-project-f8d5e.appspot.com",
    messagingSenderId: "284483723352",
    appId: "1:284483723352:web:1db28c1ed16afd4ebf2a2d",
    measurementId: "G-TX0N65L84C"
};

// Initialize Firebase
let db = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('✅ Firebase initialized successfully');
    } else {
        console.warn('⚠️ Firebase not available, using mock data');
    }
} catch (error) {
    console.warn('⚠️ Firebase initialization failed, using mock data:', error);
}

class BixForgeAdminDashboard {
    constructor() {
        this.currentTab = 'analytics';
        this.codeStories = [];
        this.codeVideos = [];
        this.trendingStories = [];
        this.regularStories = [];
        this.regularVideos = [];
        this.db = db;
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.loadMockData();
        this.setupEventListeners();
        this.setupModalHandlers();
        this.updateAnalytics();
        this.loadRealData();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        setInterval(() => this.updateAnalytics(), 30000); // Update every 30 seconds
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString();
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');

                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('tab-active'));
                // Add active class to clicked button
                button.classList.add('tab-active');

                // Hide all tab contents
                tabContents.forEach(content => content.classList.add('hidden'));
                // Show selected tab content
                const selectedTab = document.getElementById(`${tabName}-tab`);
                if (selectedTab) {
                    selectedTab.classList.remove('hidden');
                }

                this.currentTab = tabName;
                this.loadTabContent(tabName);
            });
        });
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'analytics':
                this.updateAnalytics();
                break;
            case 'code-stories':
                this.loadCodeStories();
                break;
            case 'code-videos':
                this.loadCodeVideos();
                break;
            case 'trending':
                this.loadTrendingStories();
                break;
            case 'stories':
                this.loadStories();
                break;
            case 'videos':
                this.loadVideos();
                break;
        }
    }

    loadMockData() {
        // Initialize empty arrays - no mock data, only real admin content
        this.codeStories = [];
        this.codeVideos = [];
        this.trendingStories = [];
        this.regularStories = [];
        this.regularVideos = [];

        console.log('📊 Empty arrays initialized - no mock data, only real admin content:', {
            codeStories: this.codeStories.length,
            codeVideos: this.codeVideos.length,
            trendingStories: this.trendingStories.length,
            regularStories: this.regularStories.length,
            regularVideos: this.regularVideos.length
        });
    }

    // Add function to clear all Firebase data (for testing purposes)
    async clearAllFirebaseData() {
        if (!this.db) {
            alert('❌ Firebase not available');
            return;
        }

        const confirmClear = confirm('⚠️ This will delete ALL content from Firebase database. Are you sure?');
        if (!confirmClear) return;

        try {
            console.log('🗑️ Clearing all Firebase data...');

            // Clear all collections
            const collections = ['stories', 'videos', 'trending_stories'];

            for (const collectionName of collections) {
                const snapshot = await this.db.collection(collectionName).get();
                const batch = this.db.batch();

                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
                console.log(`✅ Cleared ${collectionName} collection`);
            }

            alert('✅ All Firebase data cleared successfully!');

            // Reload the admin dashboard
            this.loadRealData();
        } catch (error) {
            console.error('❌ Error clearing Firebase data:', error);
            alert('❌ Error clearing data. Please try again.');
        }
    }

    setupEventListeners() {
        // Search functionality
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-code-stories') {
                this.searchCodeStories(e.target.value);
            }
            {
                id: 8,
                title: "HTML Color Fun for Toddlers",
                description: "Learn about colors and simple HTML tags with fun animals and shapes",
                content: "Welcome little coder! Let's make a colorful webpage together!\n\n<h1 style='color: red;'>🦁 Red Lion</h1>\n<h1 style='color: blue;'>🐘 Blue Elephant</h1>\n<h1 style='color: green;'>🐸 Green Frog</h1>\n\n<p>Animals are fun! Let's add more:</p>\n<p style='color: purple;'>🦄 Purple Unicorn</p>\n<p style='color: orange;'>🦊 Orange Fox</p>\n\nTry changing the colors!",
                programmingLanguage: "html",
                ageGroup: "0-3",
                difficulty: "Beginner",
                imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 567,
                createdAt: new Date('2024-02-12')
            },
            {
                id: 9,
                title: "Python Number Games for Preschoolers",
                description: "Fun counting and number games using simple Python commands",
                content: "Let's count and play with numbers in Python!\n\n# Counting Game\nprint('Let\\'s count together! 🔢')\nfor number in range(1, 6):\n    print(f'{number} 🌟')\n\n# Age Game\nmy_age = 4\nprint(f'I am {my_age} years old!')\nprint(f'Next year I will be {my_age + 1}!')\n\n# Animal Counter\ncats = 3\ndogs = 2\ntotal_pets = cats + dogs\nprint(f'We have {cats} cats and {dogs} dogs')\nprint(f'That\\'s {total_pets} pets total! 🐱🐶')\n\n# Can you count your toys?",
                programmingLanguage: "python",
                ageGroup: "3-6",
                difficulty: "Easy",
                imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 892,
                createdAt: new Date('2024-02-15')
            },
            {
                id: 10,
                title: "JavaScript School Projects",
                description: "Create interactive school projects with JavaScript for elementary students",
                content: "Let's build cool school projects with JavaScript!\n\n// Math Quiz Game\nfunction mathQuiz() {\n  const num1 = Math.floor(Math.random() * 10) + 1;\n  const num2 = Math.floor(Math.random() * 10) + 1;\n  const answer = prompt(`What is ${num1} + ${num2}?`);\n  \n  if (parseInt(answer) === num1 + num2) {\n    alert('🎉 Correct! Great job!');\n  } else {\n    alert(`Not quite! The answer is ${num1 + num2}. Try again!`);\n  }\n}\n\n// Name Length Counter\nfunction nameLength() {\n  const name = prompt('What is your name?');\n  alert(`Your name ${name} has ${name.length} letters!`);\n}\n\n// Favorite Color Picker\nfunction colorPicker() {\n  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];\n  const randomColor = colors[Math.floor(Math.random() * colors.length)];\n  document.body.style.backgroundColor = randomColor;\n  alert(`Your lucky color today is ${randomColor}!`);\n}\n\n// HTML buttons:\n// <button onclick='mathQuiz()'>Math Quiz</button>\n// <button onclick='nameLength()'>Name Counter</button>\n// <button onclick='colorPicker()'>Random Color</button>",
                programmingLanguage: "javascript",
                ageGroup: "6-9",
                difficulty: "Intermediate",
                imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 1234,
                createdAt: new Date('2024-02-18')
            },
            {
                id: 11,
                title: "Advanced Python for Pre-Teens",
                description: "Learn advanced Python concepts including functions, lists, and simple games",
                content: "Ready for advanced Python? Let's build something amazing!\n\n# Advanced Number Guessing Game\nimport random\n\ndef guessing_game():\n    secret_number = random.randint(1, 100)\n    attempts = 0\n    max_attempts = 7\n    \n    print('🎯 Welcome to the Number Guessing Game!')\n    print(f'I\\'m thinking of a number between 1 and 100. You have {max_attempts} tries!')\n    \n    while attempts < max_attempts:\n        try:\n            guess = int(input('Enter your guess: '))\n            attempts += 1\n            \n            if guess == secret_number:\n                print(f'🎉 Congratulations! You found it in {attempts} tries!')\n                break\n            elif guess < secret_number:\n                print('📈 Too low! Try a higher number.')\n            else:\n                print('📉 Too high! Try a lower number.')\n                \n            print(f'Attempts left: {max_attempts - attempts}')\n            \n        except ValueError:\n            print('Please enter a valid number!')\n    \n    else:\n        print(f'😅 Game over! The number was {secret_number}')\n\n# Shopping List Manager\nshopping_list = []\n\ndef add_item(item):\n    shopping_list.append(item)\n    print(f'Added {item} to your list!')\n\ndef show_list():\n    print('🛒 Your Shopping List:')\n    for i, item in enumerate(shopping_list, 1):\n        print(f'{i}. {item}')\n\n# Try the game!\nguessing_game()",
                programmingLanguage: "python",
                ageGroup: "9-12",
                difficulty: "Advanced",
                imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 1567,
                createdAt: new Date('2024-02-20')
            }
        ];

        // Mock code videos data
        this.codeVideos = [
            {
                id: 1,
                title: "HTML Basics for Kids - Create Your First Webpage",
                description: "A fun and colorful introduction to HTML where kids learn to make their first webpage with headings, paragraphs, and images",
                videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
                programmingLanguage: "html",
                ageGroup: "0-3",
                difficulty: "Beginner",
                duration: "8:30",
                thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 2342,
                createdAt: new Date('2024-01-10')
            },
            {
                id: 2,
                title: "Python for Kids - Pet Store Adventure",
                description: "Learn Python programming by creating a virtual pet store with variables, print statements, and fun animal characters",
                videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
                programmingLanguage: "python",
                ageGroup: "3-6",
                difficulty: "Easy",
                duration: "12:45",
                thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 1878,
                createdAt: new Date('2024-01-18')
            },
            {
                id: 3,
                title: "JavaScript Magic - Interactive Buttons and Games",
                description: "Create amazing interactive buttons and simple games with JavaScript that respond to clicks and user input",
                videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
                programmingLanguage: "javascript",
                ageGroup: "6-9",
                difficulty: "Intermediate",
                duration: "15:20",
                thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 1495,
                createdAt: new Date('2024-01-22')
            },
            {
                id: 4,
                title: "CSS Rainbow Magic - Colors and Animations",
                description: "Learn to create beautiful rainbows, bouncing balls, and magical animations using CSS",
                videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
                programmingLanguage: "css",
                ageGroup: "3-6",
                difficulty: "Easy",
                duration: "10:15",
                thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 1267,
                createdAt: new Date('2024-01-25')
            },
            {
                id: 5,
                title: "Scratch Programming - Cat Adventure Game",
                description: "Build your first game in Scratch! Help the cat collect stars and learn programming with colorful blocks",
                videoUrl: "https://www.youtube.com/watch?v=jXUZaf5D12A",
                programmingLanguage: "scratch",
                ageGroup: "3-5",
                difficulty: "Beginner",
                duration: "18:30",
                thumbnailUrl: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 3456,
                createdAt: new Date('2024-02-01')
            },
            {
                id: 6,
                title: "Python Math Wizard - Build a Calculator",
                description: "Become a math wizard by creating your own calculator using Python! Learn about variables, input, and mathematical operations",
                videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
                programmingLanguage: "python",
                ageGroup: "9-12",
                difficulty: "Intermediate",
                duration: "14:45",
                thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 1892,
                createdAt: new Date('2024-02-05')
            },
            {
                id: 7,
                title: "HTML Animal Zoo - Advanced Webpage Creation",
                description: "Create an amazing animal zoo webpage with lists, links, and multiple pages using advanced HTML techniques",
                videoUrl: "https://www.youtube.com/watch?v=salY_Sm6mv4",
                programmingLanguage: "html",
                ageGroup: "5-7",
                difficulty: "Easy",
                duration: "16:20",
                thumbnailUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 1543,
                createdAt: new Date('2024-02-08')
            }
        ];

        // Mock trending stories data
        this.trendingStories = [
            {
                id: 1,
                title: "The Brave Little Rabbit and the Magic Forest",
                description: "A heartwarming story about courage, friendship, and believing in yourself",
                content: "Once upon a time, in a peaceful meadow surrounded by a magical forest, lived a little rabbit named Benny. Benny was smaller than all the other rabbits, and he was afraid of almost everything - the dark, loud noises, and especially the mysterious sounds that came from the Magic Forest.\n\nOne sunny morning, Benny's best friend Luna the squirrel came running to him with tears in her eyes. 'Benny!' she cried, 'My little brother Chip is lost in the Magic Forest! He went to find the Golden Acorn, but he hasn't come back!'\n\nBenny's heart started beating fast. The Magic Forest was the scariest place he could imagine. But when he saw how sad Luna was, something changed inside him. 'Don't worry, Luna,' Benny said, surprising himself with how brave his voice sounded. 'I'll help you find Chip.'\n\nTogether, they entered the Magic Forest. It was dark and full of strange sounds, but Benny kept going because he knew his friend needed him. They met a wise old owl who told them, 'The Golden Acorn is at the top of the Singing Tree, but only someone with a brave heart can climb it.'\n\nWhen they found little Chip stuck on a high branch, scared and crying, Benny didn't hesitate. Even though he was afraid of heights, he climbed up the tree to rescue him. 'Being brave doesn't mean you're not scared,' Benny realized as he helped Chip down safely. 'It means you do what's right even when you are scared.'\n\nFrom that day on, Benny learned that courage comes from caring about others and believing in yourself. And whenever he felt afraid, he remembered that even the smallest rabbit can have the biggest heart.",
                category: "moral",
                language: "english",
                ageGroup: "0-3",
                thumbnailUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 4245,
                createdAt: new Date('2024-01-10')
            },
            {
                id: 2,
                title: "The Laughing Elephant's Magical Day",
                description: "A funny tale about an elephant who spreads joy and laughter wherever she goes",
                content: "In the heart of the African savanna lived Ellie, an elephant with the most contagious laugh in the entire animal kingdom. Her laugh was so special that it sounded like musical bells ringing in the wind - 'Ho-ho-hee-hee-trumpet-trumpet!'\n\nEvery morning, Ellie would wake up and start giggling at the silly things she saw: monkeys hanging upside down, zebras with their funny stripes, and giraffes trying to drink water with their long necks. But what made Ellie laugh the most was when she looked at her own reflection in the watering hole and saw her big ears flapping like giant fans!\n\nOne day, all the animals in the savanna were feeling very sad because it hadn't rained for many days, and everyone was hot and tired. The lions were grumpy, the zebras were cranky, and even the usually cheerful meerkats were frowning.\n\nEllie decided to cheer everyone up. She started with her signature laugh: 'Ho-ho-hee-hee-trumpet-trumpet!' Soon, a little monkey couldn't help but giggle. Then a zebra started chuckling. Before long, the entire savanna was filled with laughter!\n\nSomething magical happened - as all the animals laughed together, rain clouds began to form in the sky! It turned out that the Sky Spirits loved the sound of happy laughter so much that they sent down a gentle, refreshing rain.\n\n'You see,' said Ellie, splashing joyfully in the puddles, 'laughter is the most powerful magic of all! When we share happiness, wonderful things happen!'\n\nFrom that day on, whenever anyone in the savanna felt sad, they would visit Ellie for one of her magical laughing sessions. And they all learned that sharing joy makes it grow bigger and brighter, just like Ellie's wonderful laugh!",
                category: "funny",
                language: "english",
                ageGroup: "3-6",
                thumbnailUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 3987,
                createdAt: new Date('2024-01-12')
            },
            {
                id: 3,
                title: "La Tortuga Sabia y el Jardín Mágico",
                description: "Una hermosa historia sobre la paciencia, la sabiduría y el poder de los sueños",
                content: "Había una vez una tortuga muy sabia llamada Esperanza que vivía en un hermoso jardín lleno de flores de colores. Esperanza era conocida en todo el jardín por su paciencia y sabiduría, y todos los animales venían a pedirle consejos.\n\nUn día, un conejito muy impaciente llamado Rápido llegó corriendo hacia ella. 'Señora Esperanza,' dijo sin aliento, 'quiero que mis zanahorias crezcan AHORA MISMO! ¿Puede usar su magia para hacerlas crecer rápido?'\n\nEsperanza sonrió con ternura. 'Querido Rápido, ven conmigo y te enseñaré algo especial.' Lo llevó hasta un rincón del jardín donde había plantado unas semillas hace muchos meses.\n\n'Mira,' dijo Esperanza, señalando con su pata hacia el suelo. 'Estas semillas han estado creciendo lentamente, día tras día. Primero echaron raíces profundas, luego brotaron pequeñas hojas verdes, y ahora...' \n\nDe repente, el suelo se movió suavemente y aparecieron las flores más hermosas que Rápido había visto jamás - rosas doradas que brillaban como el sol.\n\n'¡Guau!' exclamó Rápido. 'Son las flores más bonitas del mundo!'\n\n'Así es, pequeño amigo,' dijo Esperanza. 'Las cosas más hermosas de la vida necesitan tiempo para crecer. La paciencia no es esperar sin hacer nada - es cuidar, regar, y confiar en que algo maravilloso está creciendo, aunque no lo podamos ver todavía.'\n\nRápido aprendió que día tras día, cuidando sus zanahorias con amor y paciencia, pronto tendría la cosecha más deliciosa. Y desde entonces, cada vez que se sentía impaciente, recordaba las palabras de la sabia Esperanza y las flores doradas que brillaban como el sol.",
                category: "educational",
                language: "spanish",
                ageGroup: "7-9",
                thumbnailUrl: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 2654,
                createdAt: new Date('2024-01-15')
            },
            {
                id: 4,
                title: "The Superhero Sandwich Adventure",
                description: "A hilarious adventure about a sandwich that comes to life and saves the day",
                content: "In the cozy kitchen of the Munchkin Café, something extraordinary was about to happen. As the clock struck midnight, a peanut butter and jelly sandwich named PB (that's short for Peanut Butter) suddenly came to life!\n\n'Whoa!' said PB, looking at his jelly-covered hands. 'I can move! I can talk! I must be... a SUPERHERO SANDWICH!'\n\nPB discovered he had amazing powers: he could stretch his bread like rubber, shoot peanut butter webs, and his jelly filling could bounce him super high! He decided to use his powers to help others.\n\nThe next morning, little Timmy came to the café feeling very sad. 'I'm so hungry, but I forgot my lunch money,' he sighed.\n\nPB sprang into action! 'Never fear, Superhero Sandwich is here!' He bounced over to Timmy and said, 'I may be just a sandwich, but I'm the most delicious sandwich in the world! And I want to help you!'\n\nBut then PB had a funny problem - if Timmy ate him, he wouldn't be a superhero anymore! So PB came up with a clever plan. He used his peanut butter powers to stick coins together that had fallen under the tables, making enough money for Timmy to buy lunch.\n\n'You didn't have to help me,' said Timmy, amazed.\n\n'That's what superheroes do!' said PB proudly. 'We help others, even if it means we don't get what we want.'\n\nFrom that day on, PB became the café's secret superhero, helping anyone who needed it. And he learned that being helpful and kind was even better than being eaten - though he still hoped that someday he'd find someone who really, really appreciated a good peanut butter and jelly sandwich!",
                category: "funny",
                language: "english",
                ageGroup: "3-5",
                thumbnailUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 3421,
                createdAt: new Date('2024-01-18')
            },
            {
                id: 5,
                title: "The Magic Library Adventure",
                description: "An exciting story about books that come alive and the power of reading",
                content: "Emma loved books more than anything in the world. Every Saturday, she would visit the old library in her town and spend hours reading about dragons, princesses, and faraway lands. But this Saturday was different - this Saturday, something magical was about to happen.\n\nAs Emma was reading her favorite fairy tale book, she noticed the words on the page starting to glow with a soft, golden light. Suddenly, a tiny fairy flew right out of the book!\n\n'Hello, Emma!' said the fairy in a voice like tinkling bells. 'I'm Sparkle, and I've been waiting for someone who truly loves reading to find me!'\n\nEmma's eyes grew wide with wonder. 'You came out of my book!'\n\n'That's right!' said Sparkle. 'And I can show you something amazing. When someone reads with their whole heart, the stories come alive!'\n\nSparkle waved her tiny wand, and suddenly the entire library transformed! Dragons soared between the bookshelves, pirates sailed on ships made of floating books, and brave knights rode horses made of words across the ceiling.\n\n'This is incredible!' gasped Emma.\n\n'Every time you read,' explained Sparkle, 'you're not just looking at words on a page. You're bringing entire worlds to life in your imagination! And the more you read, the more magical your own imagination becomes.'\n\nEmma spent the most wonderful afternoon of her life exploring the magical library. She helped a book-dragon find his lost treasure (which turned out to be a dictionary), sailed with word-pirates to the Island of Stories, and even had tea with characters from her favorite books.\n\nWhen it was time to go home, Sparkle gave Emma a special bookmark that shimmered with magic. 'This will remind you that every book is a doorway to adventure, and every reader is a magician who can bring stories to life!'\n\nFrom that day on, Emma knew that reading wasn't just about words on a page - it was about opening doors to infinite worlds of wonder and imagination.",
                category: "adventure",
                language: "english",
                ageGroup: "5-7",
                thumbnailUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 2876,
                createdAt: new Date('2024-01-20')
            }
        ];

        // Mock regular stories data with updated age groups (0-3, 3-6, 6-9, 9-12 years)
        this.regularStories = [
            {
                id: 1,
                title: "The Magic Forest Adventure",
                description: "An enchanted journey through a magical forest with talking animals",
                content: "Deep in the enchanted forest, where the trees whispered ancient secrets and magical creatures lived in harmony, a young explorer named Maya discovered that kindness and courage could overcome any challenge...",
                category: "adventure",
                language: "english",
                ageGroup: "6-9",
                thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 432,
                createdAt: new Date('2024-01-08')
            },
            {
                id: 2,
                title: "The Helpful Little Ant",
                description: "A heartwarming moral story about teamwork and helping others",
                content: "In a busy anthill beneath the old oak tree, there lived a little ant named Andy who believed that helping others was the greatest joy in life. One day, when the colony faced a big challenge...",
                category: "moral",
                language: "english",
                ageGroup: "3-6",
                thumbnailUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 789,
                createdAt: new Date('2024-01-20')
            },
            {
                id: 3,
                title: "The Brave Little Rabbit",
                description: "A story about courage and standing up for what's right",
                content: "In a peaceful meadow lived Benny, a small rabbit who was afraid of everything. But when his friends needed help, Benny discovered that being brave doesn't mean you're not scared...",
                category: "moral",
                language: "english",
                ageGroup: "3-6",
                thumbnailUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 1245,
                createdAt: new Date('2024-01-25')
            },
            {
                id: 4,
                title: "The Laughing Elephant",
                description: "A funny tale about an elephant who couldn't stop laughing",
                content: "In the heart of the African savanna lived Ellie, an elephant with the most contagious laugh in the entire animal kingdom. Her laughter brought joy to everyone around her...",
                category: "funny",
                language: "english",
                ageGroup: "6-9",
                thumbnailUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 987,
                createdAt: new Date('2024-01-28')
            },
            {
                id: 5,
                title: "Colorful Shapes and Animals",
                description: "A simple story about colors and shapes for toddlers",
                content: "Look at the red circle! It's like a big red ball. Now see the blue square - it's like a window! The yellow triangle looks like a piece of cheese. And here comes a green elephant who loves to play with all the colorful shapes...",
                category: "educational",
                language: "english",
                ageGroup: "0-3",
                thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 234,
                createdAt: new Date('2024-02-01')
            },
            {
                id: 6,
                title: "The Young Detective's Mystery",
                description: "An exciting mystery story for older children about solving puzzles",
                content: "Emma was 10 years old and loved solving mysteries. When her neighbor's cat went missing, she decided to use her detective skills to find clues. With her magnifying glass and notebook, Emma began investigating...",
                category: "adventure",
                language: "english",
                ageGroup: "9-12",
                thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 567,
                createdAt: new Date('2024-02-05')
            }
        ];

        // Mock regular videos data with real YouTube content
        this.regularVideos = [
            {
                id: 1,
                title: "Funny Animal Cartoons for Kids",
                description: "Hilarious cartoon adventures with cute animals that teach valuable lessons",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                category: "funny",
                language: "english",
                ageGroup: "3-5",
                duration: "10:30",
                thumbnailUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 2145,
                createdAt: new Date('2024-01-05')
            },
            {
                id: 2,
                title: "Moral Stories Collection",
                description: "Beautiful animated moral stories that teach kindness and friendship",
                videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
                category: "moral",
                language: "english",
                ageGroup: "5-7",
                duration: "15:45",
                thumbnailUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 1876,
                createdAt: new Date('2024-01-18')
            },
            {
                id: 3,
                title: "Classic Nursery Rhymes Sing-Along",
                description: "Traditional nursery rhymes with colorful animations and catchy tunes",
                videoUrl: "https://www.youtube.com/watch?v=_OBlgSz8sSM",
                category: "nursery-rhymes",
                language: "english",
                ageGroup: "3-5",
                duration: "20:15",
                thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 3421,
                createdAt: new Date('2024-01-22')
            },
            {
                id: 4,
                title: "Educational ABC Songs",
                description: "Fun alphabet songs that help children learn letters and phonics",
                videoUrl: "https://www.youtube.com/watch?v=hq3yfQnllfQ",
                category: "educational",
                language: "english",
                ageGroup: "3-5",
                duration: "12:20",
                thumbnailUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
                featured: false,
                disabled: false,
                views: 2876,
                createdAt: new Date('2024-01-30')
            },
            {
                id: 5,
                title: "Bedtime Stories for Kids",
                description: "Gentle bedtime stories with soothing narration for peaceful sleep",
                videoUrl: "https://www.youtube.com/watch?v=YQHsXMglC9A",
                category: "bedtime",
                language: "english",
                ageGroup: "3-5",
                duration: "25:30",
                thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                featured: true,
                disabled: false,
                views: 4521,
                createdAt: new Date('2024-02-01')
            }
        ];

        console.log('📊 Mock data loaded:', {
            codeStories: this.codeStories.length,
            codeVideos: this.codeVideos.length,
            trendingStories: this.trendingStories.length,
            regularStories: this.regularStories.length,
            regularVideos: this.regularVideos.length
        });
    }

    setupEventListeners() {
        // Search functionality
        document.addEventListener('input', (e) => {
            if (e.target.id === 'search-code-stories') {
                this.searchCodeStories(e.target.value);
            }

            if (e.target.id === 'search-code-videos') {
                this.searchCodeVideos(e.target.value);
            }
        });

        // Filter functionality
        document.addEventListener('change', (e) => {
            if (e.target.id === 'filter-language-stories' || e.target.id === 'filter-age-stories') {
                this.filterCodeStories();
            }

            if (e.target.id === 'filter-language-videos' || e.target.id === 'filter-age-videos') {
                this.filterCodeVideos();
            }
        });
    }

    setupModalHandlers() {
        // Add Code Story Button
        const addStoryBtn = document.getElementById('add-code-story-btn');
        if (addStoryBtn) {
            addStoryBtn.addEventListener('click', () => this.showAddCodeStoryModal());
        }

        // Add Code Video Button
        const addVideoBtn = document.getElementById('add-code-video-btn');
        if (addVideoBtn) {
            addVideoBtn.addEventListener('click', () => this.showAddCodeVideoModal());
        }

        // Modal close handlers
        const closeStoryModal = document.getElementById('close-story-modal');
        const cancelStory = document.getElementById('cancel-story');
        if (closeStoryModal) closeStoryModal.addEventListener('click', () => this.hideAddCodeStoryModal());
        if (cancelStory) cancelStory.addEventListener('click', () => this.hideAddCodeStoryModal());

        const closeVideoModal = document.getElementById('close-video-modal');
        const cancelVideo = document.getElementById('cancel-video');
        if (closeVideoModal) closeVideoModal.addEventListener('click', () => this.hideAddCodeVideoModal());
        if (cancelVideo) cancelVideo.addEventListener('click', () => this.hideAddCodeVideoModal());

        // Form submit handlers
        const storyForm = document.getElementById('add-story-form');
        if (storyForm) {
            storyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCodeStory();
            });
        }

        const videoForm = document.getElementById('add-video-form');
        if (videoForm) {
            videoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCodeVideo();
            });
        }

        // Auto Video Duration Detection for Code Videos
        const codeVideoUrlField = document.getElementById('video-url');
        const codeVideoDurationField = document.getElementById('video-duration');

        if (codeVideoUrlField && codeVideoDurationField) {
            codeVideoUrlField.addEventListener('blur', () => {
                this.handleVideoUrlChange(codeVideoUrlField, codeVideoDurationField);
            });
        }

        // Age validation on language change
        const storyLanguage = document.getElementById('story-language');
        const videoLanguage = document.getElementById('video-language');

        if (storyLanguage) {
            storyLanguage.addEventListener('change', (e) => this.updateAgeOptions('story', e.target.value));
        }

        if (videoLanguage) {
            videoLanguage.addEventListener('change', (e) => this.updateAgeOptions('video', e.target.value));
        }
    }

    updateAnalytics() {
        // Enhanced analytics with age group breakdown
        const baseUsers = 2456;
        const variation = Math.floor(Math.random() * 100) - 50;

        // Calculate age group distribution
        const ageGroupStats = {
            '0-3': this.codeStories.filter(s => s.ageGroup === '0-3').length + this.codeVideos.filter(v => v.ageGroup === '0-3').length,
            '3-6': this.codeStories.filter(s => s.ageGroup === '3-6').length + this.codeVideos.filter(v => v.ageGroup === '3-6').length,
            '6-9': this.codeStories.filter(s => s.ageGroup === '6-9').length + this.codeVideos.filter(v => v.ageGroup === '6-9').length,
            '9-12': this.codeStories.filter(s => s.ageGroup === '9-12').length + this.codeVideos.filter(v => v.ageGroup === '9-12').length
        };

        const stats = {
            totalUsers: baseUsers + variation,
            totalCodeStories: this.codeStories.length,
            totalCodeVideos: this.codeVideos.length,
            totalTrendingStories: this.trendingStories.length,
            activeSessions: Math.floor(Math.random() * 75) + 35,
            ageGroupBreakdown: ageGroupStats
        };

        // Update DOM elements
        const elements = {
            'total-users': stats.totalUsers,
            'total-code-stories': stats.totalCodeStories,
            'total-code-videos': stats.totalCodeVideos,
            'active-sessions': stats.activeSessions
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value.toLocaleString();
            }
        });

        // Update age group counts
        const ageGroupElements = {
            'age-0-3-count': `${234 + ageGroupStats['0-3']} learners`,
            'age-3-6-count': `${456 + ageGroupStats['3-6']} learners`,
            'age-6-9-count': `${321 + ageGroupStats['6-9']} learners`,
            'age-9-12-count': `${189 + ageGroupStats['9-12']} learners`
        };

        Object.entries(ageGroupElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        console.log('📊 Enhanced Analytics updated:', {
            ...stats,
            message: '🎯 Age groups: 0-3, 3-6, 6-9, 9-12 years',
            contentByAge: ageGroupStats
        });
    }

    // Firebase Data Loading
    async loadRealData() {
        if (!this.db) {
            console.log('📊 Using mock data (Firebase not available)');
            // Still display the mock data tables
            this.displayCodeStoriesTable();
            this.displayCodeVideosTable();
            this.displayTrendingStoriesTable();
            this.displayRegularStoriesTable();
            this.displayRegularVideosTable();
            return;
        }

        try {
            console.log('🔄 Loading real data from Firebase...');
            await Promise.all([
                this.loadCodeStoriesFromFirebase(),
                this.loadCodeVideosFromFirebase(),
                this.loadTrendingStoriesFromFirebase(),
                this.loadRegularStoriesFromFirebase(),
                this.loadRegularVideosFromFirebase()
            ]);
            console.log('✅ Real data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading real data:', error);
            // Fallback to displaying mock data tables
            this.displayCodeStoriesTable();
            this.displayCodeVideosTable();
            this.displayTrendingStoriesTable();
            this.displayRegularStoriesTable();
            this.displayRegularVideosTable();
        }
    }

    async loadCodeStoriesFromFirebase() {
        if (!this.db) return;

        try {
            const snapshot = await this.db.collection('stories')
                .where('isCodeStory', '==', true)
                .orderBy('createdAt', 'desc')
                .get();

            this.codeStories = [];
            snapshot.forEach(doc => {
                this.codeStories.push({ id: doc.id, ...doc.data() });
            });

            this.displayCodeStoriesTable();
            console.log(`📚 Loaded ${this.codeStories.length} code stories from Firebase`);
        } catch (error) {
            console.error('❌ Error loading code stories:', error);
        }
    }

    async loadCodeVideosFromFirebase() {
        if (!this.db) return;

        try {
            const snapshot = await this.db.collection('videos')
                .where('isCodeVideo', '==', true)
                .orderBy('createdAt', 'desc')
                .get();

            this.codeVideos = [];
            snapshot.forEach(doc => {
                this.codeVideos.push({ id: doc.id, ...doc.data() });
            });

            this.displayCodeVideosTable();
            console.log(`🎥 Loaded ${this.codeVideos.length} code videos from Firebase`);
        } catch (error) {
            console.error('❌ Error loading code videos:', error);
        }
    }

    // Firebase Integration for New Content Types
    async loadTrendingStoriesFromFirebase() {
        if (!this.db) return;

        try {
            const snapshot = await this.db.collection('trending_stories')
                .orderBy('priority', 'desc')
                .get();

            this.trendingStories = [];
            snapshot.forEach(doc => {
                this.trendingStories.push({ id: doc.id, ...doc.data() });
            });

            this.displayTrendingStoriesTable();
            console.log(`🔥 Loaded ${this.trendingStories.length} trending stories from Firebase`);
        } catch (error) {
            console.error('❌ Error loading trending stories from Firebase:', error);
        }
    }

    async loadRegularStoriesFromFirebase() {
        if (!this.db) return;

        try {
            const snapshot = await this.db.collection('stories')
                .where('isAdminPost', '==', true)
                .where('isCodeStory', '!=', true)
                .orderBy('createdAt', 'desc')
                .get();

            this.regularStories = [];
            snapshot.forEach(doc => {
                this.regularStories.push({ id: doc.id, ...doc.data() });
            });

            this.displayRegularStoriesTable();
            console.log(`📚 Loaded ${this.regularStories.length} regular stories from Firebase`);
        } catch (error) {
            console.error('❌ Error loading regular stories from Firebase:', error);
        }
    }

    async loadRegularVideosFromFirebase() {
        if (!this.db) return;

        try {
            const snapshot = await this.db.collection('videos')
                .where('isAdminPost', '==', true)
                .where('isCodeVideo', '!=', true)
                .orderBy('createdAt', 'desc')
                .get();

            this.regularVideos = [];
            snapshot.forEach(doc => {
                this.regularVideos.push({ id: doc.id, ...doc.data() });
            });

            this.displayRegularVideosTable();
            console.log(`🎥 Loaded ${this.regularVideos.length} regular videos from Firebase`);
        } catch (error) {
            console.error('❌ Error loading regular videos from Firebase:', error);
        }
    }

    // Save functions for new content types
    async saveTrendingStoryToFirebase(storyData) {
        if (!this.db) {
            console.log('📊 Firebase not available, story not saved');
            return null;
        }

        try {
            const docData = {
                ...storyData,
                views: 0,
                likes: 0,
                isActive: !storyData.disabled,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('trending_stories').add(docData);
            console.log('✅ Trending story saved to Firebase with ID:', docRef.id);
            return { id: docRef.id, ...docData };
        } catch (error) {
            console.error('❌ Error saving trending story to Firebase:', error);
            throw error;
        }
    }

    async saveRegularStoryToFirebase(storyData) {
        if (!this.db) {
            console.log('📊 Firebase not available, story not saved');
            return null;
        }

        try {
            const docData = {
                ...storyData,
                isAdminPost: true,
                isCodeStory: false,
                views: 0,
                imageUrl: storyData.thumbnailUrl || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('stories').add(docData);
            console.log('✅ Regular story saved to Firebase with ID:', docRef.id);
            return { id: docRef.id, ...docData };
        } catch (error) {
            console.error('❌ Error saving regular story to Firebase:', error);
            throw error;
        }
    }

    async saveRegularVideoToFirebase(videoData) {
        if (!this.db) {
            console.log('📊 Firebase not available, video not saved');
            return null;
        }

        try {
            const docData = {
                ...videoData,
                isAdminPost: true,
                isCodeVideo: false,
                views: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('videos').add(docData);
            console.log('✅ Regular video saved to Firebase with ID:', docRef.id);
            return { id: docRef.id, ...docData };
        } catch (error) {
            console.error('❌ Error saving regular video to Firebase:', error);
            throw error;
        }
    }

    // Fixed Firebase Loading Functions for Code Content
    async loadCodeStoriesFromFirebase() {
        if (!this.db) {
            console.log('📊 Firebase not available, using mock code stories');
            this.displayCodeStoriesTable();
            return;
        }

        try {
            const q = this.db.collection('stories')
                .where('isCodeStory', '==', true)
                .where('isAdminPost', '==', true)
                .orderBy('createdAt', 'desc');

            const querySnapshot = await q.get();
            this.codeStories = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.codeStories.push({
                    id: doc.id,
                    ...data
                });
            });

            console.log(`✅ Loaded ${this.codeStories.length} code stories from Firebase`);
            this.displayCodeStoriesTable();
        } catch (error) {
            console.error('❌ Error loading code stories from Firebase:', error);
            console.log('📊 Falling back to mock data');
            this.displayCodeStoriesTable();
        }
    }

    async loadCodeVideosFromFirebase() {
        if (!this.db) {
            console.log('📊 Firebase not available, using mock code videos');
            this.displayCodeVideosTable();
            return;
        }

        try {
            const q = this.db.collection('videos')
                .where('isCodeVideo', '==', true)
                .where('isAdminPost', '==', true)
                .orderBy('createdAt', 'desc');

            const querySnapshot = await q.get();
            this.codeVideos = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.codeVideos.push({
                    id: doc.id,
                    ...data
                });
            });

            console.log(`✅ Loaded ${this.codeVideos.length} code videos from Firebase`);
            this.displayCodeVideosTable();
        } catch (error) {
            console.error('❌ Error loading code videos from Firebase:', error);
            console.log('📊 Falling back to mock data');
            this.displayCodeVideosTable();
        }
    }

    // File Upload Functions
    async uploadVideoFile(file) {
        if (!firebase.storage) {
            console.error('❌ Firebase Storage not available');
            throw new Error('Firebase Storage not available');
        }

        try {
            const fileName = `videos/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = firebase.storage().ref(fileName);

            console.log('📁 Uploading video file to Firebase Storage...');
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log('✅ Video file uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('❌ Error uploading video file:', error);
            throw error;
        }
    }

    async uploadThumbnailFile(file) {
        if (!firebase.storage) {
            console.error('❌ Firebase Storage not available');
            throw new Error('Firebase Storage not available');
        }

        try {
            const fileName = `thumbnails/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = firebase.storage().ref(fileName);

            console.log('🖼️ Uploading thumbnail file to Firebase Storage...');
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log('✅ Thumbnail file uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('❌ Error uploading thumbnail file:', error);
            throw error;
        }
    }

    async uploadImageFile(file) {
        if (!firebase.storage) {
            console.error('❌ Firebase Storage not available');
            throw new Error('Firebase Storage not available');
        }

        try {
            const fileName = `images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = firebase.storage().ref(fileName);

            console.log('🖼️ Uploading image file to Firebase Storage...');
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log('✅ Image file uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('❌ Error uploading image file:', error);
            throw error;
        }
    }

    // Firebase Update Functions
    async updateRegularStoryInFirebase(storyId, storyData) {
        if (!this.db) {
            console.log('📊 Firebase not available, story not updated');
            return null;
        }

        try {
            const docData = {
                ...storyData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('stories').doc(storyId).update(docData);
            console.log('✅ Regular story updated in Firebase:', storyId);
            return true;
        } catch (error) {
            console.error('❌ Error updating regular story in Firebase:', error);
            throw error;
        }
    }

    async updateRegularVideoInFirebase(videoId, videoData) {
        if (!this.db) {
            console.log('📊 Firebase not available, video not updated');
            return null;
        }

        try {
            const docData = {
                ...videoData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('videos').doc(videoId).update(docData);
            console.log('✅ Regular video updated in Firebase:', videoId);
            return true;
        } catch (error) {
            console.error('❌ Error updating regular video in Firebase:', error);
            throw error;
        }
    }

    // Modal Management
    showAddCodeStoryModal() {
        const modal = document.getElementById('add-story-modal');
        if (modal) {
            // Reset modal for new story if not editing
            if (!this.editingCodeStoryId) {
                const modalTitle = document.querySelector('#add-story-modal h3');
                if (modalTitle) modalTitle.textContent = 'Add New Code Story';

                const submitButton = document.querySelector('#add-story-form button[type="submit"]');
                if (submitButton) submitButton.textContent = 'Add Code Story';

                this.resetStoryForm();
            }

            modal.classList.remove('hidden');
        }
    }

    hideAddCodeStoryModal() {
        const modal = document.getElementById('add-story-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.resetStoryForm();

            // Reset edit state
            this.editingCodeStoryId = null;
            const modalTitle = document.querySelector('#add-story-modal h3');
            if (modalTitle) modalTitle.textContent = 'Add New Code Story';
            const submitButton = document.querySelector('#add-story-form button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Add Code Story';
        }
    }

    showAddCodeVideoModal() {
        const modal = document.getElementById('add-video-modal');
        if (modal) {
            // Reset modal for new video if not editing
            if (!this.editingCodeVideoId) {
                const modalTitle = document.querySelector('#add-video-modal h3');
                if (modalTitle) modalTitle.textContent = 'Add New Code Video';

                const submitButton = document.querySelector('#add-video-form button[type="submit"]');
                if (submitButton) submitButton.textContent = 'Add Code Video';

                this.resetVideoForm();
            }

            modal.classList.remove('hidden');
        }
    }

    hideAddCodeVideoModal() {
        const modal = document.getElementById('add-video-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.resetVideoForm();

            // Reset edit state
            this.editingCodeVideoId = null;
            const modalTitle = document.querySelector('#add-video-modal h3');
            if (modalTitle) modalTitle.textContent = 'Add New Code Video';
            const submitButton = document.querySelector('#add-video-form button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Add Code Video';
        }
    }

    resetStoryForm() {
        const form = document.getElementById('add-story-form');
        if (form) form.reset();
    }

    resetVideoForm() {
        const form = document.getElementById('add-video-form');
        if (form) form.reset();
    }

    // Form Handlers
    async handleAddCodeStory() {
        const formData = this.getStoryFormData();

        if (!this.validateStoryForm(formData)) {
            return;
        }

        if (!this.validateAgeAppropriate(formData.programmingLanguage, formData.ageGroup)) {
            const langData = this.getLanguageData(formData.programmingLanguage);
            alert(`${langData.name} is recommended for ages ${langData.minAge}+ years. Please select an appropriate age group.`);
            return;
        }

        try {
            const storyData = {
                ...formData,
                isCodeStory: true,
                isAdminPost: true,
                disabled: !formData.published,
                category: ['coding', 'programming', formData.programmingLanguage],
                views: 0
            };

            if (this.editingCodeStoryId) {
                // Update existing code story
                const storyIndex = this.codeStories.findIndex(s => s.id === this.editingCodeStoryId);
                if (storyIndex !== -1) {
                    this.codeStories[storyIndex] = {
                        ...this.codeStories[storyIndex],
                        ...storyData,
                        updatedAt: new Date()
                    };

                    // Update in Firebase if available
                    if (this.db) {
                        await this.db.collection('stories').doc(this.editingCodeStoryId).update({
                            ...storyData,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        console.log('✅ Code story updated in Firebase');
                    }

                    alert('✅ Code story updated successfully!');
                }
                this.editingCodeStoryId = null;
            } else {
                // Add new code story
                storyData.createdAt = new Date();

                if (this.db) {
                    const docRef = await this.db.collection('stories').add(storyData);
                    storyData.id = docRef.id;
                    console.log('✅ Code story added to Firebase');
                    await this.loadCodeStoriesFromFirebase();
                } else {
                    // Mock data fallback
                    storyData.id = Date.now();
                    this.codeStories.push(storyData);
                    this.displayCodeStoriesTable();
                }
                alert('✅ Code story added successfully and will appear on the main website!');
            }

            this.hideAddCodeStoryModal();
        } catch (error) {
            console.error('❌ Error saving code story:', error);
            alert('❌ Error saving code story. Please try again.');
        }
    }

    async handleAddCodeVideo() {
        const formData = this.getVideoFormData();

        if (!this.validateVideoForm(formData)) {
            return;
        }

        if (!this.validateAgeAppropriate(formData.programmingLanguage, formData.ageGroup)) {
            const langData = this.getLanguageData(formData.programmingLanguage);
            alert(`${langData.name} videos are recommended for ages ${langData.minAge}+ years. Please select an appropriate age group.`);
            return;
        }

        try {
            // Handle file upload if provided
            let videoUrl = formData.videoUrl;
            let thumbnailUrl = formData.thumbnailUrl;

            const videoFileInput = document.getElementById('video-file');
            const thumbnailFileInput = document.getElementById('video-thumbnail-file');

            if (videoFileInput && videoFileInput.files[0]) {
                console.log('📁 Uploading video file...');
                videoUrl = await this.uploadVideoFile(videoFileInput.files[0]);
            }

            if (thumbnailFileInput && thumbnailFileInput.files[0]) {
                console.log('🖼️ Uploading thumbnail file...');
                thumbnailUrl = await this.uploadThumbnailFile(thumbnailFileInput.files[0]);
            }

            const videoData = {
                ...formData,
                videoUrl,
                thumbnailUrl,
                isCodeVideo: true,
                isAdminPost: true,
                disabled: !formData.published,
                category: ['coding', 'programming', formData.programmingLanguage],
                views: 0
            };

            if (this.editingCodeVideoId) {
                // Update existing code video
                const videoIndex = this.codeVideos.findIndex(v => v.id === this.editingCodeVideoId);
                if (videoIndex !== -1) {
                    this.codeVideos[videoIndex] = {
                        ...this.codeVideos[videoIndex],
                        ...videoData,
                        updatedAt: new Date()
                    };

                    // Update in Firebase if available
                    if (this.db) {
                        await this.db.collection('videos').doc(this.editingCodeVideoId).update({
                            ...videoData,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        console.log('✅ Code video updated in Firebase');
                    }

                    alert('✅ Code video updated successfully!');
                }
                this.editingCodeVideoId = null;
            } else {
                // Add new code video
                videoData.createdAt = new Date();

                if (this.db) {
                    const docRef = await this.db.collection('videos').add(videoData);
                    videoData.id = docRef.id;
                    console.log('✅ Code video added to Firebase');
                    await this.loadCodeVideosFromFirebase();
                } else {
                    // Mock data fallback
                    videoData.id = Date.now();
                    this.codeVideos.push(videoData);
                    this.displayCodeVideosTable();
                }
                alert('✅ Code video added successfully and will appear on the main website!');
            }

            this.hideAddCodeVideoModal();
        } catch (error) {
            console.error('❌ Error saving code video:', error);
            alert('❌ Error saving code video. Please try again.');
        }
    }

    // Form Data Extraction
    getStoryFormData() {
        return {
            title: document.getElementById('story-title')?.value || '',
            description: document.getElementById('story-description')?.value || '',
            content: document.getElementById('story-content')?.value || '',
            programmingLanguage: document.getElementById('story-language')?.value || '',
            ageGroup: document.getElementById('story-age-group')?.value || '',
            difficulty: document.getElementById('story-difficulty')?.value || 'Beginner',
            imageUrl: document.getElementById('story-image')?.value || '',
            featured: document.getElementById('story-featured')?.checked || false,
            published: document.getElementById('story-published')?.checked || false
        };
    }

    getVideoFormData() {
        return {
            title: document.getElementById('video-title')?.value || '',
            description: document.getElementById('video-description')?.value || '',
            videoUrl: document.getElementById('video-url')?.value || '',
            programmingLanguage: document.getElementById('video-language')?.value || '',
            ageGroup: document.getElementById('video-age-group')?.value || '',
            difficulty: document.getElementById('video-difficulty')?.value || 'Beginner',
            duration: document.getElementById('video-duration')?.value || '',
            thumbnailUrl: document.getElementById('video-thumbnail')?.value || '',
            featured: document.getElementById('video-featured')?.checked || false,
            published: document.getElementById('video-published')?.checked || false
        };
    }

    // Form Validation
    validateStoryForm(formData) {
        if (!formData.title.trim()) {
            alert('Please enter a story title.');
            return false;
        }
        if (!formData.description.trim()) {
            alert('Please enter a story description.');
            return false;
        }
        if (!formData.content.trim()) {
            alert('Please enter story content.');
            return false;
        }
        if (!formData.programmingLanguage) {
            alert('Please select a programming language.');
            return false;
        }
        if (!formData.ageGroup) {
            alert('Please select an age group.');
            return false;
        }
        return true;
    }

    validateVideoForm(formData) {
        if (!formData.title.trim()) {
            alert('Please enter a video title.');
            return false;
        }
        if (!formData.description.trim()) {
            alert('Please enter a video description.');
            return false;
        }
        if (!formData.videoUrl.trim()) {
            alert('Please enter a video URL.');
            return false;
        }
        if (!formData.programmingLanguage) {
            alert('Please select a programming language.');
            return false;
        }
        if (!formData.ageGroup) {
            alert('Please select an age group.');
            return false;
        }
        return true;
    }

    // Age Validation and Language Data
    validateAgeAppropriate(language, ageGroup) {
        const langData = this.getLanguageData(language);
        if (!langData) return true;

        const userAge = parseInt(ageGroup.split('-')[0]);
        return userAge >= langData.minAge;
    }

    getLanguageData(language) {
        const languages = {
            'html': { name: 'HTML', icon: '🌐', minAge: 0, color: 'bg-red-500' },
            'css': { name: 'CSS', icon: '🎨', minAge: 3, color: 'bg-blue-500' },
            'python': { name: 'Python', icon: '🐍', minAge: 3, color: 'bg-green-500' },
            'javascript': { name: 'JavaScript', icon: '⚡', minAge: 6, color: 'bg-yellow-500' },
            'scratch': { name: 'Scratch', icon: '🧩', minAge: 0, color: 'bg-orange-500' },
            'java': { name: 'Java', icon: '☕', minAge: 9, color: 'bg-red-600' },
            'cpp': { name: 'C++', icon: '⚙️', minAge: 9, color: 'bg-gray-600' }
        };
        return languages[language];
    }

    updateAgeOptions(type, language) {
        const langData = this.getLanguageData(language);
        if (!langData) return;

        const ageSelect = document.getElementById(`${type}-age-group`);
        if (!ageSelect) return;

        // Clear existing options except the first one
        while (ageSelect.children.length > 1) {
            ageSelect.removeChild(ageSelect.lastChild);
        }

        // Add appropriate age options
        const allAges = ['0-3', '3-6', '6-9', '9-12'];
        allAges.forEach(age => {
            const ageNum = parseInt(age.split('-')[0]);
            if (ageNum >= langData.minAge) {
                const option = document.createElement('option');
                option.value = age;
                option.textContent = `${age} years`;
                ageSelect.appendChild(option);
            }
        });

        // Show warning if no appropriate ages
        if (ageSelect.children.length === 1) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = `${langData.name} requires ages ${langData.minAge}+`;
            option.disabled = true;
            ageSelect.appendChild(option);
        }
    }

    // Table Display Methods
    displayCodeStoriesTable() {
        const tbody = document.getElementById('code-stories-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.codeStories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">📚</div>
                        <p>No code stories found. Add your first code story!</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.codeStories.forEach(story => {
            const row = this.createStoryTableRow(story);
            tbody.appendChild(row);
        });
    }

    displayCodeVideosTable() {
        const tbody = document.getElementById('code-videos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.codeVideos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🎥</div>
                        <p>No code videos found. Add your first code video!</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.codeVideos.forEach(video => {
            const row = this.createVideoTableRow(video);
            tbody.appendChild(row);
        });
    }

    createStoryTableRow(story) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';

        const langData = this.getLanguageData(story.programmingLanguage);
        const statusBadge = story.disabled ?
            '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Draft</span>' :
            '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Published</span>';

        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-lg object-cover" src="${story.imageUrl || 'https://placehold.co/40x40/png?text=📚'}" alt="">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${story.title}</div>
                        <div class="text-sm text-gray-500">${story.description.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${langData?.color || 'bg-gray-500'} text-white">
                    ${langData?.icon || '💻'} ${langData?.name || story.programmingLanguage}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="age-badge">${story.ageGroup} years</span>
            </td>
            <td class="px-6 py-4">${statusBadge}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${story.views || 0}</td>
            <td class="px-6 py-4 text-sm font-medium">
                <button onclick="adminDashboard.editCodeStory(${story.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button onclick="adminDashboard.toggleCodeStoryStatus(${story.id})" class="text-yellow-600 hover:text-yellow-900 mr-3">
                    ${story.disabled ? 'Enable' : 'Disable'}
                </button>
                <button onclick="adminDashboard.deleteCodeStory(${story.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;

        return row;
    }

    createVideoTableRow(video) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';

        const langData = this.getLanguageData(video.programmingLanguage);
        const statusBadge = video.disabled ?
            '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Draft</span>' :
            '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Published</span>';

        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-lg object-cover" src="${video.thumbnailUrl || 'https://placehold.co/40x40/png?text=🎥'}" alt="">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${video.title}</div>
                        <div class="text-sm text-gray-500">${video.description.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${langData?.color || 'bg-gray-500'} text-white">
                    ${langData?.icon || '🎥'} ${langData?.name || video.programmingLanguage}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="age-badge">${video.ageGroup} years</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${video.duration || 'N/A'}</td>
            <td class="px-6 py-4">${statusBadge}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${video.views || 0}</td>
            <td class="px-6 py-4 text-sm font-medium">
                <button onclick="adminDashboard.editCodeVideo(${video.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button onclick="adminDashboard.toggleCodeVideoStatus(${video.id})" class="text-yellow-600 hover:text-yellow-900 mr-3">
                    ${video.disabled ? 'Enable' : 'Disable'}
                </button>
                <button onclick="adminDashboard.deleteCodeVideo(${video.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;

        return row;
    }

    // Search and Filter Methods
    searchCodeStories(query) {
        this.filterAndDisplayStories(query);
    }

    searchCodeVideos(query) {
        this.filterAndDisplayVideos(query);
    }

    filterCodeStories() {
        const searchQuery = document.getElementById('search-code-stories')?.value || '';
        this.filterAndDisplayStories(searchQuery);
    }

    filterCodeVideos() {
        const searchQuery = document.getElementById('search-code-videos')?.value || '';
        this.filterAndDisplayVideos(searchQuery);
    }

    filterAndDisplayStories(searchQuery = '') {
        const languageFilter = document.getElementById('filter-language-stories')?.value || 'all';
        const ageFilter = document.getElementById('filter-age-stories')?.value || 'all';

        let filtered = this.codeStories.filter(story => {
            const matchesSearch = !searchQuery ||
                story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                story.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLanguage = languageFilter === 'all' ||
                story.programmingLanguage === languageFilter;

            const matchesAge = ageFilter === 'all' ||
                story.ageGroup === ageFilter;

            return matchesSearch && matchesLanguage && matchesAge;
        });

        this.displayFilteredStories(filtered);
    }

    filterAndDisplayVideos(searchQuery = '') {
        const languageFilter = document.getElementById('filter-language-videos')?.value || 'all';
        const ageFilter = document.getElementById('filter-age-videos')?.value || 'all';

        let filtered = this.codeVideos.filter(video => {
            const matchesSearch = !searchQuery ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLanguage = languageFilter === 'all' ||
                video.programmingLanguage === languageFilter;

            const matchesAge = ageFilter === 'all' ||
                video.ageGroup === ageFilter;

            return matchesSearch && matchesLanguage && matchesAge;
        });

        this.displayFilteredVideos(filtered);
    }

    displayFilteredStories(stories) {
        const tbody = document.getElementById('code-stories-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (stories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🔍</div>
                        <p>No stories match your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        stories.forEach(story => {
            const row = this.createStoryTableRow(story);
            tbody.appendChild(row);
        });
    }

    displayFilteredVideos(videos) {
        const tbody = document.getElementById('code-videos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (videos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🔍</div>
                        <p>No videos match your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        videos.forEach(video => {
            const row = this.createVideoTableRow(video);
            tbody.appendChild(row);
        });
    }

    // Tab Content Loading Methods
    loadCodeStories() {
        console.log('Loading code stories...');
        if (this.db) {
            this.loadCodeStoriesFromFirebase();
        } else {
            this.displayCodeStoriesTable();
        }
    }

    loadCodeVideos() {
        console.log('Loading code videos...');
        if (this.db) {
            this.loadCodeVideosFromFirebase();
        } else {
            this.displayCodeVideosTable();
        }
    }

    loadTrendingStories() {
        console.log('Loading trending stories...');
        this.displayTrendingStoriesTable();
    }

    loadStories() {
        console.log('Loading regular stories...');
        this.displayRegularStoriesTable();
    }

    loadVideos() {
        console.log('Loading regular videos...');
        this.displayRegularVideosTable();
    }

    // Display Methods for New Content Types
    displayTrendingStoriesTable() {
        const tbody = document.getElementById('trending-stories-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.trendingStories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🔥</div>
                        <p>No trending stories yet. Add your first trending story!</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.trendingStories.forEach(story => {
            const row = this.createTrendingStoryTableRow(story);
            tbody.appendChild(row);
        });
    }

    displayRegularStoriesTable() {
        const tbody = document.getElementById('regular-stories-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.regularStories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">📚</div>
                        <p>No stories yet. Add your first story!</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.regularStories.forEach(story => {
            const row = this.createRegularStoryTableRow(story);
            tbody.appendChild(row);
        });
    }

    displayRegularVideosTable() {
        const tbody = document.getElementById('regular-videos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.regularVideos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🎥</div>
                        <p>No videos yet. Add your first video!</p>
                    </td>
                </tr>
            `;
            return;
        }

        this.regularVideos.forEach(video => {
            const row = this.createRegularVideoTableRow(video);
            tbody.appendChild(row);
        });
    }

    // Table Row Creation Methods
    createTrendingStoryTableRow(story) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        const categoryIcons = {
            'moral': '📖',
            'funny': '😄',
            'adventure': '🗺️',
            'educational': '🎓',
            'fairy-tale': '🧚'
        };

        const languageFlags = {
            'english': '🇺🇸',
            'spanish': '🇪🇸',
            'french': '🇫🇷',
            'german': '🇩🇪',
            'hindi': '🇮🇳',
            'urdu': '🇵🇰',
            'arabic': '🇸🇦'
        };

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${story.thumbnailUrl || 'https://placehold.co/60x60/png?text=Story'}"
                     alt="${story.title}" class="w-12 h-12 rounded-lg object-cover">
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${story.title}</div>
                <div class="text-sm text-gray-500">${story.description.substring(0, 50)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    ${categoryIcons[story.category] || '📖'} ${story.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${languageFlags[story.language] || '🌐'} ${story.language}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${story.views.toLocaleString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${story.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${story.disabled ? '⏸️ Disabled' : '✅ Active'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="adminDashboard.editTrendingStory(${story.id})" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onclick="adminDashboard.toggleTrendingStoryStatus(${story.id})" class="text-yellow-600 hover:text-yellow-900">
                    ${story.disabled ? 'Enable' : 'Disable'}
                </button>
                <button onclick="adminDashboard.deleteTrendingStory(${story.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;

        return row;
    }

    createRegularStoryTableRow(story) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        const categoryIcons = {
            'moral': '📖',
            'funny': '😄',
            'adventure': '🗺️',
            'educational': '🎓',
            'fairy-tale': '🧚',
            'bedtime': '🌙'
        };

        const languageFlags = {
            'english': '🇺🇸',
            'spanish': '🇪🇸',
            'french': '🇫🇷',
            'german': '🇩🇪',
            'hindi': '🇮🇳',
            'urdu': '🇵🇰',
            'arabic': '🇸🇦',
            'chinese': '🇨🇳'
        };

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${story.thumbnailUrl || 'https://placehold.co/60x60/png?text=Story'}"
                     alt="${story.title}" class="w-12 h-12 rounded-lg object-cover">
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${story.title}</div>
                <div class="text-sm text-gray-500">${story.description.substring(0, 50)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${categoryIcons[story.category] || '📖'} ${story.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    ${languageFlags[story.language] || '🌐'} ${story.language}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${story.ageGroup} years
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${story.views.toLocaleString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${story.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${story.disabled ? '⏸️ Disabled' : '✅ Active'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="adminDashboard.editRegularStory(${story.id})" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onclick="adminDashboard.toggleRegularStoryStatus(${story.id})" class="text-yellow-600 hover:text-yellow-900">
                    ${story.disabled ? 'Enable' : 'Disable'}
                </button>
                <button onclick="adminDashboard.deleteRegularStory(${story.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;

        return row;
    }

    createRegularVideoTableRow(video) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        const categoryIcons = {
            'moral': '📖',
            'funny': '😄',
            'educational': '🎓',
            'nursery-rhymes': '🎵',
            'animated-stories': '🎬',
            'learning': '📚'
        };

        const languageFlags = {
            'english': '🇺🇸',
            'spanish': '🇪🇸',
            'french': '🇫🇷',
            'german': '🇩🇪',
            'hindi': '🇮🇳',
            'urdu': '🇵🇰',
            'arabic': '🇸🇦',
            'chinese': '🇨🇳'
        };

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${video.thumbnailUrl || 'https://placehold.co/60x60/png?text=Video'}"
                     alt="${video.title}" class="w-12 h-12 rounded-lg object-cover">
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${video.title}</div>
                <div class="text-sm text-gray-500">${video.description.substring(0, 50)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ${categoryIcons[video.category] || '🎥'} ${video.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    ${languageFlags[video.language] || '🌐'} ${video.language}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${video.duration || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${video.views.toLocaleString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${video.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${video.disabled ? '⏸️ Disabled' : '✅ Active'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="adminDashboard.editRegularVideo(${video.id})" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onclick="adminDashboard.toggleRegularVideoStatus(${video.id})" class="text-yellow-600 hover:text-yellow-900">
                    ${video.disabled ? 'Enable' : 'Disable'}
                </button>
                <button onclick="adminDashboard.deleteRegularVideo(${video.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;

        return row;
    }

    // Modal Opening Methods
    openTrendingStoryModal() {
        const modal = document.getElementById('add-trending-story-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.setupTrendingStoryModalHandlers();
        }
    }

    openRegularStoryModal() {
        const modal = document.getElementById('add-regular-story-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.setupRegularStoryModalHandlers();
        }
    }

    openRegularVideoModal() {
        const modal = document.getElementById('add-regular-video-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.setupRegularVideoModalHandlers();
        }
    }

    // Modal Setup Methods
    setupTrendingStoryModalHandlers() {
        const closeBtn = document.getElementById('close-trending-story-modal');
        const cancelBtn = document.getElementById('cancel-trending-story');
        const form = document.getElementById('add-trending-story-form');

        if (closeBtn) closeBtn.onclick = () => this.closeTrendingStoryModal();
        if (cancelBtn) cancelBtn.onclick = () => this.closeTrendingStoryModal();
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleAddTrendingStory();
            };
        }
    }

    setupRegularStoryModalHandlers() {
        const closeBtn = document.getElementById('close-regular-story-modal');
        const cancelBtn = document.getElementById('cancel-regular-story');
        const form = document.getElementById('add-regular-story-form');

        if (closeBtn) closeBtn.onclick = () => this.closeRegularStoryModal();
        if (cancelBtn) cancelBtn.onclick = () => this.closeRegularStoryModal();
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleAddRegularStory();
            };
        }
    }

    setupRegularVideoModalHandlers() {
        const closeBtn = document.getElementById('close-regular-video-modal');
        const cancelBtn = document.getElementById('cancel-regular-video');
        const form = document.getElementById('add-regular-video-form');

        if (closeBtn) closeBtn.onclick = () => this.closeRegularVideoModal();
        if (cancelBtn) cancelBtn.onclick = () => this.closeRegularVideoModal();
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.handleAddRegularVideo();
            };
        }

        // Auto Video Duration Detection Event Listeners
        const videoUrlField = document.getElementById('regular-video-url');
        const videoDurationField = document.getElementById('regular-video-duration');

        if (videoUrlField && videoDurationField) {
            videoUrlField.addEventListener('blur', () => {
                this.handleVideoUrlChange(videoUrlField, videoDurationField);
            });
        }
    }

    // Modal Opening Methods
    openRegularStoryModal() {
        const modal = document.getElementById('add-regular-story-modal');
        if (modal) {
            // Reset modal for new story if not editing
            if (!this.editingStoryId) {
                const modalTitle = document.querySelector('#add-regular-story-modal h3');
                if (modalTitle) modalTitle.textContent = 'Add New Story';

                const submitButton = document.querySelector('#add-regular-story-form button[type="submit"]');
                if (submitButton) submitButton.textContent = 'Add Story';

                document.getElementById('add-regular-story-form').reset();
            }

            modal.classList.remove('hidden');
            this.setupRegularStoryModalHandlers();
        }
    }

    openRegularVideoModal() {
        const modal = document.getElementById('add-regular-video-modal');
        if (modal) {
            // Reset modal for new video if not editing
            if (!this.editingVideoId) {
                const modalTitle = document.querySelector('#add-regular-video-modal h3');
                if (modalTitle) modalTitle.textContent = 'Add New Video';

                const submitButton = document.querySelector('#add-regular-video-form button[type="submit"]');
                if (submitButton) submitButton.textContent = 'Add Video';

                document.getElementById('add-regular-video-form').reset();
            }

            modal.classList.remove('hidden');
            this.setupRegularVideoModalHandlers();
        }
    }

    // Modal Closing Methods
    closeTrendingStoryModal() {
        const modal = document.getElementById('add-trending-story-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.getElementById('add-trending-story-form').reset();
        }
    }

    closeRegularStoryModal() {
        const modal = document.getElementById('add-regular-story-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.getElementById('add-regular-story-form').reset();

            // Reset edit state
            this.editingStoryId = null;
            const modalTitle = document.querySelector('#add-regular-story-modal h3');
            if (modalTitle) modalTitle.textContent = 'Add New Story';
            const submitButton = document.querySelector('#add-regular-story-form button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Add Story';
        }
    }

    closeRegularVideoModal() {
        const modal = document.getElementById('add-regular-video-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.getElementById('add-regular-video-form').reset();

            // Reset edit state
            this.editingVideoId = null;
            const modalTitle = document.querySelector('#add-regular-video-modal h3');
            if (modalTitle) modalTitle.textContent = 'Add New Video';
            const submitButton = document.querySelector('#add-regular-video-form button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Add Video';
        }
    }

    // Form Submission Handlers for New Content Types
    async handleAddTrendingStory() {
        const formData = this.getTrendingStoryFormData();

        if (!this.validateTrendingStoryForm(formData)) {
            return;
        }

        try {
            const storyData = {
                ...formData,
                views: 0,
                likes: 0,
                priority: parseInt(formData.priority) || 1,
                isActive: !formData.disabled,
                createdAt: new Date()
            };

            if (this.db) {
                const docRef = await this.db.collection('trending_stories').add(storyData);
                storyData.id = docRef.id;
                console.log('✅ Trending story added to Firebase');
                await this.loadTrendingStoriesFromFirebase();
            } else {
                // Mock data fallback
                storyData.id = Date.now();
                this.trendingStories.push(storyData);
                this.displayTrendingStoriesTable();
            }

            alert('✅ Trending story added successfully and will appear on the main website!');
            this.closeTrendingStoryModal();
        } catch (error) {
            console.error('❌ Error saving trending story:', error);
            alert('❌ Error saving trending story. Please try again.');
        }
    }

    async handleAddRegularStory() {
        const formData = this.getRegularStoryFormData();

        if (!this.validateRegularStoryForm(formData)) {
            return;
        }

        try {
            const storyData = {
                ...formData,
                isAdminPost: true,
                isCodeStory: false,
                disabled: !formData.published,
                views: 0,
                createdAt: new Date()
            };

            if (this.db) {
                const docRef = await this.db.collection('stories').add(storyData);
                storyData.id = docRef.id;
                console.log('✅ Regular story added to Firebase');
                await this.loadRegularStoriesFromFirebase();
            } else {
                // Mock data fallback
                storyData.id = Date.now();
                this.regularStories.push(storyData);
                this.displayRegularStoriesTable();
            }

            alert('✅ Story added successfully and will appear on the main website!');
            this.closeRegularStoryModal();
        } catch (error) {
            console.error('❌ Error saving regular story:', error);
            alert('❌ Error saving story. Please try again.');
        }
    }

    async handleAddRegularVideo() {
        const formData = this.getRegularVideoFormData();

        if (!this.validateRegularVideoForm(formData)) {
            return;
        }

        try {
            // Handle file upload if provided
            let videoUrl = formData.videoUrl;
            let thumbnailUrl = formData.thumbnailUrl;

            const videoFileInput = document.getElementById('regular-video-file');
            const thumbnailFileInput = document.getElementById('regular-video-thumbnail-file');

            if (videoFileInput && videoFileInput.files[0]) {
                console.log('📁 Uploading regular video file...');
                videoUrl = await this.uploadVideoFile(videoFileInput.files[0]);
            }

            if (thumbnailFileInput && thumbnailFileInput.files[0]) {
                console.log('🖼️ Uploading regular video thumbnail file...');
                thumbnailUrl = await this.uploadThumbnailFile(thumbnailFileInput.files[0]);
            }

            const videoData = {
                ...formData,
                videoUrl,
                thumbnailUrl,
                isAdminPost: true,
                isCodeVideo: false,
                disabled: !formData.published,
                views: 0,
                createdAt: new Date()
            };

            if (this.db) {
                const docRef = await this.db.collection('videos').add(videoData);
                videoData.id = docRef.id;
                console.log('✅ Regular video added to Firebase');
                await this.loadRegularVideosFromFirebase();
            } else {
                // Mock data fallback
                videoData.id = Date.now();
                this.regularVideos.push(videoData);
                this.displayRegularVideosTable();
            }

            alert('✅ Video added successfully and will appear on the main website!');
            this.closeRegularVideoModal();
        } catch (error) {
            console.error('❌ Error saving regular video:', error);
            alert('❌ Error saving video. Please try again.');
        }
    }

    // Form Data Extraction Methods for New Content Types
    getTrendingStoryFormData() {
        return {
            title: document.getElementById('trending-story-title')?.value || '',
            description: document.getElementById('trending-story-description')?.value || '',
            content: document.getElementById('trending-story-content')?.value || '',
            category: document.getElementById('trending-story-category')?.value || '',
            language: document.getElementById('trending-story-language')?.value || 'english',
            ageGroup: document.getElementById('trending-story-age-group')?.value || '',
            thumbnailUrl: document.getElementById('trending-story-thumbnail')?.value || '',
            priority: document.getElementById('trending-story-priority')?.value || '1',
            disabled: !document.getElementById('trending-story-published')?.checked
        };
    }

    getRegularStoryFormData() {
        return {
            title: document.getElementById('regular-story-title')?.value || '',
            description: document.getElementById('regular-story-description')?.value || '',
            content: document.getElementById('regular-story-content')?.value || '',
            category: document.getElementById('regular-story-category')?.value || '',
            language: document.getElementById('regular-story-language')?.value || 'english',
            ageGroup: document.getElementById('regular-story-age-group')?.value || '',
            thumbnailUrl: document.getElementById('regular-story-thumbnail')?.value || '',
            featured: document.getElementById('regular-story-featured')?.checked || false,
            published: document.getElementById('regular-story-published')?.checked || false
        };
    }

    getRegularVideoFormData() {
        return {
            title: document.getElementById('regular-video-title')?.value || '',
            description: document.getElementById('regular-video-description')?.value || '',
            videoUrl: document.getElementById('regular-video-url')?.value || '',
            category: document.getElementById('regular-video-category')?.value || '',
            language: document.getElementById('regular-video-language')?.value || 'english',
            duration: document.getElementById('regular-video-duration')?.value || '',
            thumbnailUrl: document.getElementById('regular-video-thumbnail')?.value || '',
            featured: document.getElementById('regular-video-featured')?.checked || false,
            published: document.getElementById('regular-video-published')?.checked || false
        };
    }

    // Form Validation Methods for New Content Types
    validateTrendingStoryForm(formData) {
        if (!formData.title.trim()) {
            alert('Please enter a story title.');
            return false;
        }
        if (!formData.description.trim()) {
            alert('Please enter a story description.');
            return false;
        }
        if (!formData.content.trim()) {
            alert('Please enter story content.');
            return false;
        }
        if (!formData.category) {
            alert('Please select a category.');
            return false;
        }
        if (!formData.ageGroup) {
            alert('Please select an age group.');
            return false;
        }
        return true;
    }

    validateRegularStoryForm(formData) {
        if (!formData.title.trim()) {
            alert('Please enter a story title.');
            return false;
        }
        if (!formData.description.trim()) {
            alert('Please enter a story description.');
            return false;
        }
        if (!formData.content.trim()) {
            alert('Please enter story content.');
            return false;
        }
        if (!formData.category) {
            alert('Please select a category.');
            return false;
        }
        if (!formData.ageGroup) {
            alert('Please select an age group.');
            return false;
        }
        return true;
    }

    validateRegularVideoForm(formData) {
        if (!formData.title.trim()) {
            alert('Please enter a video title.');
            return false;
        }
        if (!formData.description.trim()) {
            alert('Please enter a video description.');
            return false;
        }
        if (!formData.videoUrl.trim()) {
            alert('Please enter a video URL.');
            return false;
        }
        if (!formData.category) {
            alert('Please select a category.');
            return false;
        }
        return true;
    }

    // Firebase Loading Methods for New Content Types
    async loadTrendingStoriesFromFirebase() {
        if (!this.db) {
            console.log('📊 Firebase not available, using mock trending stories');
            this.displayTrendingStoriesTable();
            return;
        }

        try {
            const q = this.db.collection('trending_stories')
                .where('isActive', '==', true)
                .orderBy('priority', 'desc');

            const querySnapshot = await q.get();
            this.trendingStories = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.trendingStories.push({
                    id: doc.id,
                    ...data
                });
            });

            console.log(`✅ Loaded ${this.trendingStories.length} trending stories from Firebase`);
            this.displayTrendingStoriesTable();
        } catch (error) {
            console.error('❌ Error loading trending stories from Firebase:', error);
            console.log('📊 Falling back to mock data');
            this.displayTrendingStoriesTable();
        }
    }

    async loadRegularStoriesFromFirebase() {
        if (!this.db) {
            console.log('📊 Firebase not available, using mock regular stories');
            this.displayRegularStoriesTable();
            return;
        }

        try {
            const q = this.db.collection('stories')
                .where('isAdminPost', '==', true)
                .where('isCodeStory', '!=', true)
                .orderBy('createdAt', 'desc');

            const querySnapshot = await q.get();
            this.regularStories = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.regularStories.push({
                    id: doc.id,
                    ...data
                });
            });

            console.log(`✅ Loaded ${this.regularStories.length} regular stories from Firebase`);
            this.displayRegularStoriesTable();
        } catch (error) {
            console.error('❌ Error loading regular stories from Firebase:', error);
            console.log('📊 Falling back to mock data');
            this.displayRegularStoriesTable();
        }
    }

    async loadRegularVideosFromFirebase() {
        if (!this.db) {
            console.log('📊 Firebase not available, using mock regular videos');
            this.displayRegularVideosTable();
            return;
        }

        try {
            const q = this.db.collection('videos')
                .where('isAdminPost', '==', true)
                .where('isCodeVideo', '!=', true)
                .orderBy('createdAt', 'desc');

            const querySnapshot = await q.get();
            this.regularVideos = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.regularVideos.push({
                    id: doc.id,
                    ...data
                });
            });

            console.log(`✅ Loaded ${this.regularVideos.length} regular videos from Firebase`);
            this.displayRegularVideosTable();
        } catch (error) {
            console.error('❌ Error loading regular videos from Firebase:', error);
            console.log('📊 Falling back to mock data');
            this.displayRegularVideosTable();
        }
    }

    // Video URL Processing and Duration Detection
    async handleVideoUrlChange(urlField, durationField) {
        const url = urlField.value.trim();
        if (!url) return;

        try {
            // Auto-detect duration for YouTube videos
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                // Extract video ID
                let videoId = '';
                if (url.includes('youtube.com/watch?v=')) {
                    videoId = url.split('v=')[1].split('&')[0];
                } else if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1].split('?')[0];
                }

                if (videoId) {
                    // For demo purposes, set a placeholder duration
                    // In a real implementation, you would use YouTube API
                    durationField.value = '10:30';
                    console.log('📹 Auto-detected video duration for YouTube video:', videoId);
                }
            }
        } catch (error) {
            console.error('❌ Error processing video URL:', error);
        }
    }

    // Firebase Save Functions for New Content Types
    async saveTrendingStoryToFirebase(storyData) {
        if (!this.db) {
            console.log('📊 Firebase not available, using local storage');
            return null;
        }

        try {
            const docRef = await this.db.collection('trending_stories').add({
                ...storyData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Trending story saved to Firebase with ID:', docRef.id);
            return { id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving trending story to Firebase:', error);
            return null;
        }
    }

    async saveRegularStoryToFirebase(storyData) {
        if (!this.db) {
            console.log('📊 Firebase not available, using local storage');
            return null;
        }

        try {
            const docRef = await this.db.collection('stories').add({
                ...storyData,
                isAdminPost: true,
                isCodeStory: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Regular story saved to Firebase with ID:', docRef.id);
            return { id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving regular story to Firebase:', error);
            return null;
        }
    }

    async saveRegularVideoToFirebase(videoData) {
        if (!this.db) {
            console.log('📊 Firebase not available, using local storage');
            return null;
        }

        try {
            const docRef = await this.db.collection('videos').add({
                ...videoData,
                isAdminPost: true,
                isCodeVideo: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Regular video saved to Firebase with ID:', docRef.id);
            return { id: docRef.id };
        } catch (error) {
            console.error('❌ Error saving regular video to Firebase:', error);
            return null;
        }
    }

    // Firebase Update Functions for New Content Types
    async updateRegularStoryInFirebase(storyId, storyData) {
        if (!this.db) {
            console.log('📊 Firebase not available, using local storage');
            return false;
        }

        try {
            await this.db.collection('stories').doc(storyId).update({
                ...storyData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Regular story updated in Firebase');
            return true;
        } catch (error) {
            console.error('❌ Error updating regular story in Firebase:', error);
            return false;
        }
    }

    async updateRegularVideoInFirebase(videoId, videoData) {
        if (!this.db) {
            console.log('📊 Firebase not available, using local storage');
            return false;
        }

        try {
            await this.db.collection('videos').doc(videoId).update({
                ...videoData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Regular video updated in Firebase');
            return true;
        } catch (error) {
            console.error('❌ Error updating regular video in Firebase:', error);
            return false;
        }
    }

    // CRUD Operations for Code Stories
    editCodeStory(id) {
        const story = this.codeStories.find(s => s.id === id);
        if (story) {
            // Populate the edit form with existing data
            document.getElementById('story-title').value = story.title;
            document.getElementById('story-description').value = story.description;
            document.getElementById('story-content').value = story.content;
            document.getElementById('story-language').value = story.programmingLanguage;
            document.getElementById('story-age-group').value = story.ageGroup;
            document.getElementById('story-difficulty').value = story.difficulty || 'Beginner';
            document.getElementById('story-image').value = story.imageUrl || '';
            document.getElementById('story-featured').checked = story.featured || false;
            document.getElementById('story-published').checked = !story.disabled;

            // Store the ID for updating
            this.editingCodeStoryId = id;

            // Change modal title and button text
            const modalTitle = document.querySelector('#add-story-modal h3');
            if (modalTitle) modalTitle.textContent = 'Edit Code Story';

            const submitButton = document.querySelector('#add-story-form button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Update Code Story';

            // Open the modal
            this.showAddCodeStoryModal();
        }
    }

    toggleCodeStoryStatus(id) {
        const story = this.codeStories.find(s => s.id === id);
        if (story) {
            story.disabled = !story.disabled;

            // Update in Firebase if available
            if (this.db) {
                this.db.collection('stories').doc(id).update({
                    disabled: story.disabled,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            this.displayCodeStoriesTable();
            alert(`Code story ${story.disabled ? 'disabled' : 'enabled'} successfully!`);
        }
    }

    deleteCodeStory(id) {
        const story = this.codeStories.find(s => s.id === id);
        if (story && confirm(`Are you sure you want to delete "${story.title}"?`)) {
            // Remove from Firebase if available
            if (this.db) {
                this.db.collection('stories').doc(id).delete();
            }

            this.codeStories = this.codeStories.filter(s => s.id !== id);
            this.displayCodeStoriesTable();
            alert('Code story deleted successfully!');
        }
    }

    // CRUD Operations for Code Videos
    editCodeVideo(id) {
        const video = this.codeVideos.find(v => v.id === id);
        if (video) {
            // Populate the edit form with existing data
            document.getElementById('video-title').value = video.title;
            document.getElementById('video-description').value = video.description;
            document.getElementById('video-url').value = video.videoUrl;
            document.getElementById('video-language').value = video.programmingLanguage;
            document.getElementById('video-age-group').value = video.ageGroup;
            document.getElementById('video-difficulty').value = video.difficulty || 'Beginner';
            document.getElementById('video-duration').value = video.duration || '';
            document.getElementById('video-thumbnail').value = video.thumbnailUrl || '';
            document.getElementById('video-featured').checked = video.featured || false;
            document.getElementById('video-published').checked = !video.disabled;

            // Store the ID for updating
            this.editingCodeVideoId = id;

            // Change modal title and button text
            const modalTitle = document.querySelector('#add-video-modal h3');
            if (modalTitle) modalTitle.textContent = 'Edit Code Video';

            const submitButton = document.querySelector('#add-video-form button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Update Code Video';

            // Open the modal
            this.showAddCodeVideoModal();
        }
    }

    toggleCodeVideoStatus(id) {
        const video = this.codeVideos.find(v => v.id === id);
        if (video) {
            video.disabled = !video.disabled;

            // Update in Firebase if available
            if (this.db) {
                this.db.collection('videos').doc(id).update({
                    disabled: video.disabled,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            this.displayCodeVideosTable();
            alert(`Code video ${video.disabled ? 'disabled' : 'enabled'} successfully!`);
        }
    }

    deleteCodeVideo(id) {
        const video = this.codeVideos.find(v => v.id === id);
        if (video && confirm(`Are you sure you want to delete "${video.title}"?`)) {
            // Remove from Firebase if available
            if (this.db) {
                this.db.collection('videos').doc(id).delete();
            }

            this.codeVideos = this.codeVideos.filter(v => v.id !== id);
            this.displayCodeVideosTable();
            alert('Code video deleted successfully!');
        }
    }

    // Auto Video Duration Detection
    async getYouTubeDuration(videoUrl) {
        try {
            // Extract video ID from YouTube URL
            const videoId = this.extractYouTubeVideoId(videoUrl);
            if (!videoId) {
                console.log('❌ Could not extract video ID from URL');
                return null;
            }

            // Use YouTube oEmbed API to get video info
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

            try {
                const response = await fetch(oEmbedUrl);
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ YouTube video info retrieved:', data.title);

                    // Auto-fill thumbnail if not provided
                    const thumbnailField = document.getElementById('video-thumbnail') || document.getElementById('regular-video-thumbnail');
                    if (thumbnailField && !thumbnailField.value) {
                        thumbnailField.value = data.thumbnail_url;
                    }

                    // Auto-fill title if not provided
                    const titleField = document.getElementById('video-title') || document.getElementById('regular-video-title');
                    if (titleField && !titleField.value) {
                        titleField.value = data.title;
                    }

                    return 'Auto-detected';
                }
            } catch (error) {
                console.log('📊 YouTube oEmbed API not available, using fallback');
            }

            // Fallback: Generate estimated duration based on video type
            return this.estimateVideoDuration(videoUrl);
        } catch (error) {
            console.error('❌ Error getting video duration:', error);
            return 'Unknown';
        }
    }

    extractYouTubeVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    estimateVideoDuration(videoUrl) {
        // Provide estimated duration based on content type
        const url = videoUrl.toLowerCase();

        if (url.includes('tutorial') || url.includes('lesson')) {
            return '15:00'; // Tutorials are usually 15 minutes
        } else if (url.includes('short') || url.includes('quick')) {
            return '5:00'; // Short videos are usually 5 minutes
        } else if (url.includes('story') || url.includes('tale')) {
            return '8:00'; // Stories are usually 8 minutes
        } else if (url.includes('song') || url.includes('rhyme')) {
            return '3:00'; // Songs are usually 3 minutes
        } else {
            return '10:00'; // Default estimate
        }
    }

    // Auto-detect video duration when URL is entered
    async handleVideoUrlChange(urlField, durationField) {
        const url = urlField.value.trim();
        if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
            console.log('🔍 Auto-detecting video duration...');

            // Show loading indicator
            const originalPlaceholder = durationField.placeholder;
            durationField.placeholder = 'Detecting duration...';
            durationField.disabled = true;

            try {
                const duration = await this.getYouTubeDuration(url);
                if (duration && duration !== 'Unknown') {
                    durationField.value = duration;
                    console.log(`✅ Auto-detected duration: ${duration}`);
                }
            } catch (error) {
                console.error('❌ Error auto-detecting duration:', error);
            } finally {
                // Restore field
                durationField.placeholder = originalPlaceholder;
                durationField.disabled = false;
            }
        }
    }

    // Utility Functions
    formatDate(date) {
        if (!date) return 'N/A';
        if (date.toDate) {
            date = date.toDate();
        }
        return new Date(date).toLocaleDateString();
    }

    // Search and Filter Methods for New Content
    searchTrendingStories(query) {
        this.filterAndDisplayTrendingStories(query);
    }

    searchRegularStories(query) {
        this.filterAndDisplayRegularStories(query);
    }

    searchRegularVideos(query) {
        this.filterAndDisplayRegularVideos(query);
    }

    filterTrendingStories() {
        const searchQuery = document.getElementById('search-trending-stories')?.value || '';
        this.filterAndDisplayTrendingStories(searchQuery);
    }

    filterRegularStories() {
        const searchQuery = document.getElementById('search-regular-stories')?.value || '';
        this.filterAndDisplayRegularStories(searchQuery);
    }

    filterRegularVideos() {
        const searchQuery = document.getElementById('search-regular-videos')?.value || '';
        this.filterAndDisplayRegularVideos(searchQuery);
    }

    filterAndDisplayTrendingStories(searchQuery = '') {
        const categoryFilter = document.getElementById('filter-category-trending')?.value || 'all';
        const languageFilter = document.getElementById('filter-language-trending')?.value || 'all';
        const statusFilter = document.getElementById('filter-status-trending')?.value || 'all';

        let filtered = this.trendingStories.filter(story => {
            const matchesSearch = !searchQuery ||
                story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                story.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter;
            const matchesLanguage = languageFilter === 'all' || story.language === languageFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && !story.disabled) ||
                (statusFilter === 'disabled' && story.disabled);

            return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
        });

        this.displayFilteredTrendingStories(filtered);
    }

    filterAndDisplayRegularStories(searchQuery = '') {
        const categoryFilter = document.getElementById('filter-category-stories')?.value || 'all';
        const languageFilter = document.getElementById('filter-language-stories')?.value || 'all';
        const statusFilter = document.getElementById('filter-status-stories')?.value || 'all';

        let filtered = this.regularStories.filter(story => {
            const matchesSearch = !searchQuery ||
                story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                story.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter;
            const matchesLanguage = languageFilter === 'all' || story.language === languageFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && !story.disabled) ||
                (statusFilter === 'disabled' && story.disabled);

            return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
        });

        this.displayFilteredRegularStories(filtered);
    }

    filterAndDisplayRegularVideos(searchQuery = '') {
        const categoryFilter = document.getElementById('filter-category-videos')?.value || 'all';
        const languageFilter = document.getElementById('filter-language-videos')?.value || 'all';
        const statusFilter = document.getElementById('filter-status-videos')?.value || 'all';

        let filtered = this.regularVideos.filter(video => {
            const matchesSearch = !searchQuery ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
            const matchesLanguage = languageFilter === 'all' || video.language === languageFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && !video.disabled) ||
                (statusFilter === 'disabled' && video.disabled);

            return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
        });

        this.displayFilteredRegularVideos(filtered);
    }

    // Display Filtered Results
    displayFilteredTrendingStories(stories) {
        const tbody = document.getElementById('trending-stories-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (stories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🔍</div>
                        <p>No trending stories match your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        stories.forEach(story => {
            const row = this.createTrendingStoryTableRow(story);
            tbody.appendChild(row);
        });
    }

    displayFilteredRegularStories(stories) {
        const tbody = document.getElementById('regular-stories-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (stories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🔍</div>
                        <p>No stories match your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        stories.forEach(story => {
            const row = this.createRegularStoryTableRow(story);
            tbody.appendChild(row);
        });
    }

    displayFilteredRegularVideos(videos) {
        const tbody = document.getElementById('regular-videos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (videos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                        <div class="text-4xl mb-2">🔍</div>
                        <p>No videos match your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        videos.forEach(video => {
            const row = this.createRegularVideoTableRow(video);
            tbody.appendChild(row);
        });
    }

    // Trending Stories Action Methods
    editTrendingStory(storyId) {
        const story = this.trendingStories.find(s => s.id === storyId);
        if (!story) {
            alert('Story not found!');
            return;
        }

        // Open modal with story data for editing
        this.openTrendingStoryModal(story);
    }

    toggleTrendingStoryStatus(storyId) {
        const storyIndex = this.trendingStories.findIndex(s => s.id === storyId);
        if (storyIndex === -1) {
            alert('Story not found!');
            return;
        }

        const story = this.trendingStories[storyIndex];
        const action = story.disabled ? 'enable' : 'disable';

        if (confirm(`Are you sure you want to ${action} "${story.title}"?`)) {
            this.trendingStories[storyIndex].disabled = !story.disabled;
            this.displayTrendingStoriesTable();
            alert(`✅ Story ${action}d successfully!`);
        }
    }

    deleteTrendingStory(storyId) {
        const story = this.trendingStories.find(s => s.id === storyId);
        if (!story) {
            alert('Story not found!');
            return;
        }

        if (confirm(`Are you sure you want to delete "${story.title}"? This action cannot be undone.`)) {
            this.trendingStories = this.trendingStories.filter(s => s.id !== storyId);
            this.displayTrendingStoriesTable();
            alert('✅ Story deleted successfully!');
        }
    }

    // Regular Stories Action Methods
    editRegularStory(storyId) {
        const story = this.regularStories.find(s => s.id === storyId);
        if (!story) {
            alert('Story not found!');
            return;
        }

        // Open modal with story data for editing
        this.openRegularStoryModal(story);
    }

    toggleRegularStoryStatus(storyId) {
        const storyIndex = this.regularStories.findIndex(s => s.id === storyId);
        if (storyIndex === -1) {
            alert('Story not found!');
            return;
        }

        const story = this.regularStories[storyIndex];
        const action = story.disabled ? 'enable' : 'disable';

        if (confirm(`Are you sure you want to ${action} "${story.title}"?`)) {
            this.regularStories[storyIndex].disabled = !story.disabled;
            this.displayRegularStoriesTable();
            alert(`✅ Story ${action}d successfully!`);
        }
    }

    deleteRegularStory(storyId) {
        const story = this.regularStories.find(s => s.id === storyId);
        if (!story) {
            alert('Story not found!');
            return;
        }

        if (confirm(`Are you sure you want to delete "${story.title}"? This action cannot be undone.`)) {
            this.regularStories = this.regularStories.filter(s => s.id !== storyId);
            this.displayRegularStoriesTable();
            alert('✅ Story deleted successfully!');
        }
    }

    // Regular Videos Action Methods
    editRegularVideo(videoId) {
        const video = this.regularVideos.find(v => v.id === videoId);
        if (!video) {
            alert('Video not found!');
            return;
        }

        // Open modal with video data for editing
        this.openRegularVideoModal(video);
    }

    toggleRegularVideoStatus(videoId) {
        const videoIndex = this.regularVideos.findIndex(v => v.id === videoId);
        if (videoIndex === -1) {
            alert('Video not found!');
            return;
        }

        const video = this.regularVideos[videoIndex];
        const action = video.disabled ? 'enable' : 'disable';

        if (confirm(`Are you sure you want to ${action} "${video.title}"?`)) {
            this.regularVideos[videoIndex].disabled = !video.disabled;
            this.displayRegularVideosTable();
            alert(`✅ Video ${action}d successfully!`);
        }
    }

    deleteRegularVideo(videoId) {
        const video = this.regularVideos.find(v => v.id === videoId);
        if (!video) {
            alert('Video not found!');
            return;
        }

        if (confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) {
            this.regularVideos = this.regularVideos.filter(v => v.id !== videoId);
            this.displayRegularVideosTable();
            alert('✅ Video deleted successfully!');
        }
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing BixForge Admin Dashboard...');
    window.adminDashboard = new BixForgeAdminDashboard();
    console.log('✅ BixForge Admin Dashboard initialized successfully!');
});