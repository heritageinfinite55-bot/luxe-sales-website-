// Simple JavaScript for your first project
document.addEventListener('DOMContentLoaded', function() {
    // Get the button and message elements
    const button = document.getElementById('clickMe');
    const message = document.getElementById('message');
    
    // Array of fun messages to display
    const messages = [
        "🎉 Awesome! You're doing great!",
        "🚀 Keep coding, keep learning!",
        "💡 You're becoming a developer!",
        "🌟 Every expert was once a beginner!",
        "🎯 You're on the right track!",
        "🌈 Coding is fun, right?",
        "⚡ You're making progress!",
        "🎨 Creating amazing things!"
    ];
    
    // Counter for clicks
    let clickCount = 0;
    
    // Add click event listener to the button
    button.addEventListener('click', function() {
        clickCount++;
        
        // Get a random message
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Update the message with click count
        message.textContent = `${randomMessage} (Clicked ${clickCount} times)`;
        
        // Add a fun animation
        message.style.transform = 'scale(1.1)';
        setTimeout(() => {
            message.style.transform = 'scale(1)';
        }, 200);
        
        // Change button color on click
        button.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    });
    
    console.log('Welcome to your first web project!');
    console.log('Open the browser console to see more messages as you code!');
});
