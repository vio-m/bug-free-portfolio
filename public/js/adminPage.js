//CANCEL BTN
document.addEventListener('DOMContentLoaded', function() {
    var closeButtons = document.querySelectorAll('.cancel');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var elements = document.querySelectorAll('.manage-project');
            elements.forEach(function(element){
                element.style.display = 'none';
            });
        });
    });
});

//RESET COUNTER
document.getElementById('resetCounterForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        const response = await fetch('/reset-counter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
    console.error('Error while resetting download counter:', error);
    }
});






