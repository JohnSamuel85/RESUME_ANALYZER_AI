document.addEventListener('DOMContentLoaded', () => {

    // ---- True Premium Antigravity Network effect ----
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                
                // Extremely slow drift for that "antigravity" suspended feel
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges smoothly
                if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
                if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;

                // Mouse Repulsion Physics
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;

                    if (distance < maxDistance) {
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        function init() {
            particles = [];
            let numberOfParticles = (window.innerWidth * window.innerHeight) / 9000;
            // Cap particles for performance, but keep it dense enough for the network effect
            if (numberOfParticles > 250) numberOfParticles = 250;
            
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = dx * dx + dy * dy;

                    // Draw lines if particles are close
                    if (distance < (window.innerWidth / 7) * (window.innerHeight / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.4})`; // Premium Blue tint
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            // Crisp White Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            // Particle Fill Style
            ctx.fillStyle = 'rgba(37, 99, 235, 0.8)'; // Solid Blue Dots

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
        }

        init();
        animate();
    }


    // ---- Scroll Reveal Animation Logic ----
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Analyzer App Logic ----
    const fileUpload = document.getElementById('resume-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const form = document.getElementById('analyzer-form');
    
    const inputPanel = document.querySelector('.input-panel');
    const loadingPanel = document.getElementById('loadingIndicator');
    const resultsPanel = document.getElementById('resultsDashboard');

    // Handle file selection display
    if(fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileNameDisplay.innerHTML = `<strong>${e.target.files[0].name}</strong><br><small>File ready for analysis</small>`;
                fileNameDisplay.style.color = 'var(--text-primary)';
                document.querySelector('.upload-icon-ring').style.background = '#dcfce7';
                document.querySelector('.upload-icon-ring i').style.color = '#10b981';
                document.querySelector('.upload-icon-ring i').className = 'fa-solid fa-file-circle-check';
                document.querySelector('.upload-label').style.borderColor = '#10b981';
            } else {
                fileNameDisplay.innerHTML = 'Drag & Drop Resume (PDF, DOCX, JPG)<br><small>or Click to Browse</small>';
                fileNameDisplay.style.color = 'var(--text-secondary)';
                document.querySelector('.upload-icon-ring').style.background = 'white';
                document.querySelector('.upload-icon-ring i').style.color = 'var(--text-primary)';
                document.querySelector('.upload-icon-ring i').className = 'fa-solid fa-cloud-arrow-up';
                document.querySelector('.upload-label').style.borderColor = 'rgba(0,0,0,0.15)';
            }
        });
    }

    // Handle form submission
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Show Loading State
            inputPanel.classList.add('hidden');
            resultsPanel.classList.add('hidden');
            loadingPanel.classList.remove('hidden');

            loadingPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const steps = document.querySelectorAll('.processing-steps .step');
            let currentStep = 0;
            
            steps.forEach(s => s.classList.remove('active'));
            if(steps.length > 0) steps[0].classList.add('active');

            const stepInterval = setInterval(() => {
                if (currentStep < steps.length - 1) {
                    steps[currentStep].classList.remove('active');
                    currentStep++;
                    steps[currentStep].classList.add('active');
                }
            }, 2500);

            const formData = new FormData();
            const fileField = document.querySelector('input[type="file"]');
            const jobDescField = document.querySelector('textarea[name="job_description"]');

            formData.append('resume', fileField.files[0]);
            formData.append('job_description', jobDescField.value);

            try {
                const response = await fetch('/analyze', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                clearInterval(stepInterval);

                if (data.success) {
                    displayResults(data);
                    
                    loadingPanel.classList.add('hidden');
                    resultsPanel.classList.remove('hidden');

                    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });

                } else {
                    throw new Error(data.error || 'Failed to analyze resume');
                }

            } catch (error) {
                clearInterval(stepInterval);
                console.error('Error:', error);
                alert('Error analyzing resume: ' + error.message);
                loadingPanel.classList.add('hidden');
                inputPanel.classList.remove('hidden');
            }
        });
    }

    const toPercentage = (val) => Math.min(Math.max((val / 10) * 100, 0), 100);

    function displayResults(data) {
        const score = data.score;
        
        const scoreEl = document.getElementById('overall-score');
        let currentNum = 0;
        const targetNum = score;
        const increment = targetNum / 30; 
        
        const counter = setInterval(() => {
            currentNum += increment;
            if (currentNum >= targetNum) {
                scoreEl.textContent = targetNum.toFixed(1);
                clearInterval(counter);
            } else {
                scoreEl.textContent = currentNum.toFixed(1);
            }
        }, 30);
        
        const circle = document.getElementById('overall-score-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        const percentage = toPercentage(score);
        const offset = circumference - (percentage / 100) * circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
            
            // Clean stark colors for bright theme
            if (score >= 8) circle.style.stroke = 'var(--text-primary)';
            else if (score >= 5) circle.style.stroke = '#64748b';
            else circle.style.stroke = '#94a3b8';
        }, 100);

        document.getElementById('relevance-score').textContent = `${data.relevance_score}/10`;
        document.getElementById('sentiment-score').textContent = `${data.sentiment_score}/10`;

        setTimeout(() => {
            document.getElementById('relevance-bar').style.width = `${toPercentage(data.relevance_score)}%`;
            document.getElementById('sentiment-bar').style.width = `${toPercentage(data.sentiment_score)}%`;
        }, 200);

        const skillsContainer = document.getElementById('matched-skills');
        const noSkillsMsg = document.getElementById('no-skills-msg');
        skillsContainer.innerHTML = '';
        
        if (data.skills && data.skills.length > 0) {
            noSkillsMsg.classList.add('hidden');
            data.skills.forEach((skill, index) => {
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.textContent = skill;
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(10px)';
                tag.style.transition = 'all 0.4s ease';
                tag.style.transitionDelay = `${index * 0.05}s`;
                skillsContainer.appendChild(tag);
                
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0)';
                    }, 50);
                });
            });
        } else {
            noSkillsMsg.classList.remove('hidden');
        }

        const feedbackContainer = document.getElementById('gemini-feedback');
        if (data.gemini_feedback) {
            feedbackContainer.innerHTML = marked.parse(data.gemini_feedback);
        } else {
            feedbackContainer.innerHTML = '<p class="text-muted">No feedback generated.</p>';
        }
    }
});
