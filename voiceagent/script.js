document.addEventListener('DOMContentLoaded', () => {
    const orb = document.getElementById('voice-orb');
    const statusText = document.getElementById('status-text');
    const micBtn = document.getElementById('mic-btn');
    const messageInput = document.getElementById('message-input');
    const closeBtn = document.getElementById('close-btn');

    let currentState = 'state-idle';
    const states = [
        { class: 'state-idle', text: 'Idle' },
        { class: 'state-listening', text: 'Listening...' },
        { class: 'state-thinking', text: 'Thinking...' },
        { class: 'state-speaking', text: 'Speaking...' }
    ];
    let stateIndex = 0;

    function setState(newStateIndex) {
        orb.classList.remove(states[stateIndex].class);
        stateIndex = newStateIndex;
        orb.classList.add(states[stateIndex].class);
        statusText.textContent = states[stateIndex].text;
    }

    let mediaRecorder = null;
    let audioChunks = [];

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await sendAudioToBackend(audioBlob);
            };

            mediaRecorder.start(); 
            setState(1); // Listening state
            
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not available. Please allow mic access in your browser.");
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop(); // This triggers onstop, which sends the data
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setState(2); // Thinking state
        }
    }

    async function sendAudioToBackend(audioBlob) {
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");

            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData
            });

            if (response.status === 204) {
                // No content, back to idle
                setState(0);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const audioBlobResponse = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlobResponse);
            const audio = new Audio(audioUrl);
            
            setState(3); // Speaking state
            audio.play();
            
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                setState(0); // Go back to idle
            };

        } catch (error) {
            console.error("Error sending audio to backend:", error);
            setState(0); // Error, go back to idle
        }
    }

    // Toggle mic on/off
    micBtn.addEventListener('click', () => {
        if (stateIndex === 1) { // If currently listening
            stopRecording();
        } else {
            startRecording();
        }
    });

    // Submitting text from the input bar (optional: currently disabled since it's a voice agent)
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && messageInput.value.trim() !== '') {
            messageInput.value = '';
            alert("Text chat is disabled. Please use the microphone!");
        }
    });

    closeBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        setState(0);
    });
});
