<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toni Maluleka - Support Technician</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #f8fafc;
            --dark: #1e293b;
            --light: #f1f5f9;
            --gray: #64748b;
            --light-gray: #e2e8f0;
            --success: #10b981;
        }
        
        body {
            background-color: var(--light);
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 30px;
            margin-bottom: 30px;
        }
        
        h1, h2, h3 {
            margin-bottom: 15px;
            color: var(--dark);
        }
        
        h1 {
            font-size: 2.5rem;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 10px;
            display: inline-block;
        }
        
        h2 {
            font-size: 1.8rem;
            color: var(--primary);
            position: relative;
            padding-left: 20px;
        }
        
        h2:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 30px;
            background: var(--primary);
            border-radius: 4px;
        }
        
        .btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid var(--primary);
        }
        
        .btn:hover {
            background: transparent;
            color: var(--primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
        }
        
        .btn-outline {
            background: transparent;
            color: var(--primary);
        }
        
        .btn-outline:hover {
            background: var(--primary);
            color: white;
        }
        
        /* Header Styles */
        header {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 60px 0;
            text-align: center;
            border-radius: 0 0 20px 20px;
            margin-bottom: 40px;
        }
        
        .profile-img {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            border: 5px solid white;
            object-fit: cover;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .tagline {
            font-size: 1.4rem;
            font-weight: 300;
            margin: 15px 0 25px;
            opacity: 0.9;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        .social-links a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            color: white;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .social-links a:hover {
            background: white;
            color: var(--primary);
            transform: translateY(-3px);
        }
        
        /* About Section */
        .about-content {
            display: flex;
            gap: 30px;
            align-items: center;
        }
        
        .about-text {
            flex: 1;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }
        
        .skill {
            background: var(--light);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        /* Experience & Education */
        .timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .timeline:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 2px;
            background: var(--light-gray);
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 30px;
            padding-bottom: 30px;
        }
        
        .timeline-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .timeline-item:before {
            content: '';
            position: absolute;
            left: -36px;
            top: 0;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--primary);
            border: 3px solid white;
            box-shadow: 0 0 0 2px var(--primary);
        }
        
        .timeline-date {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            margin-bottom: 10px;
        }
        
        .timeline-title {
            font-size: 1.3rem;
            margin-bottom: 8px;
        }
        
        .timeline-subtitle {
            color: var(--primary);
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        /* Contact */
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }
        
        .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        
        .contact-icon {
            width: 50px;
            height: 50px;
            background: var(--light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
            font-size: 1.2rem;
        }
        
        /* Footer */
        footer {
            text-align: center;
            padding: 30px 0;
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .about-content {
                flex-direction: column;
                text-align: center;
            }
            
            .profile-img {
                width: 150px;
                height: 150px;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            .container {
                padding: 15px;
            }
            
            section {
                padding: 20px;
            }
        }
        
        @media (max-width: 480px) {
            .profile-img {
                width: 120px;
                height: 120px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            .btn {
                display: block;
                margin: 10px auto;
                width: 80%;
            }
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <header>
        <div class="container">
            <img src="Graduation.jpg" alt="Profile Photo" class="profile-img">
            <h1>Toni Maluleka</h1>
            <p class="tagline">Support Technician</p>
            <div class="social-links">
                <a href="https://www.linkedin.com/in/toni-maluleka-27591b12a/"><i class="fab fa-linkedin-in"></i></a>
                <a href="#"><i class="fab fa-github"></i></a>
            </div>
            <div style="margin-top: 25px;">
                <a href="Toni Maluleka.pdf" class="btn">Download CV</a>
            </div>
        </div>
    </header>

    <div class="container">
        <!-- About Section -->
        <section id="about">
            <h2>About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>Dedicated and adaptable IT Support Technician with hands-on experience in system administration, network management, and end-user support. Proficient in Microsoft 365, Active Directory, firewall configuration, and automation scripting. Passionate about optimizing IT infrastructure for performance, security, and reliability.</p>
                    <p>Currently serving as a Junior IT Officer at S-Plane Automations (on secondment) and providing remote support as a Technician Engineer at Gravit8. Strong foundation in Linux, networking, cybersecurity, and Python/PowerShell automation.</p>
                    
                    <div class="skills">
                        <span class="skill">Microsoft 365 Admin</span>
                        <span class="skill">Active Directory</span>
                        <span class="skill">Firewall (pfSense, Sophos)</span>
                        <span class="skill">Networking (Ubiquiti, MikroTik)</span>
                        <span class="skill">Linux (Debian)</span>
                        <span class="skill">PowerShell & Python</span>
                        <span class="skill">VMware & Hyper-V</span>
                        <span class="skill">Backup (Acronis)</span>
                        <span class="skill">IT Documentation</span>
                        <span class="skill">Customer Support</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Experience Section -->
        <section id="experience">
            <h2>Professional Experience</h2>
            <div class="timeline">
                <div class="timeline-item">
                    <span class="timeline-date">Aug 2024 – Present</span>
                    <h3 class="timeline-title">Junior IT Officer</h3>
                    <p class="timeline-subtitle">S-Plane Automations (Secondment)</p>
                    <p>Onsite Support Engineer working with VSA, IT Glue, Kaseya One, Jira & Odoo. Responsibilities include:</p>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li>Managing Microsoft 365 environment (Exchange, Teams, SharePoint)</li>
                        <li>Firewall management (pfSense, Sophos, ESET)</li>
                        <li>Configuring and upgrading Ubiquiti APs, switches, and MikroTik routers</li>
                        <li>Administering Active Directory, Hyper-V, and Debian systems</li>
                        <li>Implementing backup solutions using Acronis NAS</li>
                        <li>Automating tasks via PowerShell and VSA scripts</li>
                        <li>Diagnosing and resolving hardware/software issues</li>
                    </ul>
                </div>
                <div class="timeline-item">
                    <span class="timeline-date">Jun 2023 – Present</span>
                    <h3 class="timeline-title">Support Technician Engineer</h3>
                    <p class="timeline-subtitle">Gravit8 (Remote)</p>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li>Provided remote technical support for diverse hardware and software issues</li>
                        <li>Configured PCs, routers, and network equipment</li>
                        <li>Managed VMware, Active Directory, and firewall setups</li>
                        <li>Maintained and repaired servers</li>
                        <li>Trained interns and mentored junior technicians</li>
                        <li>Monitored system performance and security compliance</li>
                    </ul>
                </div>
                <div class="timeline-item">
                    <span class="timeline-date">Jan 2018 – Dec 2020</span>
                    <h3 class="timeline-title">Owner & Technician</h3>
                    <p class="timeline-subtitle">Internet Café</p>
                    <p>Operated a small internet café offering computer and phone repairs, wired and Wi-Fi internet services, and general tech support to local customers.</p>
                </div>
                <div class="timeline-item">
                    <span class="timeline-date">Jun 2021 – Nov 2021</span>
                    <h3 class="timeline-title">Support Technician Intern</h3>
                    <p class="timeline-subtitle">Kgadime Matsepe Secondary School</p>
                    <p>Provided on-site IT support including troubleshooting hardware, software, and network issues. Assisted with Microsoft 365 user management.</p>
                </div>
            </div>
        </section>

        <!-- Education Section -->
        <section id="education">
            <h2>Education</h2>
            <div class="timeline">
                <div class="timeline-item">
                    <span class="timeline-date">2024</span>
                    <h3 class="timeline-title">Diploma in Communication Networks (NQF 6)</h3>
                    <p class="timeline-subtitle">Cape Peninsula University of Technology (CPUT)</p>
                </div>
                <div class="timeline-item">
                    <span class="timeline-date">2018</span>
                    <h3 class="timeline-title">Higher Certificate in ICT (NQF 5)</h3>
                    <p class="timeline-subtitle">Cape Peninsula University of Technology (CPUT)</p>
                </div>
                <div class="timeline-item">
                    <span class="timeline-date">2015</span>
                    <h3 class="timeline-title">National Certificate in System Development (NQF 4)</h3>
                    <p class="timeline-subtitle">CTU Training Solutions</p>
                </div>
                <div class="timeline-item">
                    <span class="timeline-date">2014</span>
                    <h3 class="timeline-title">Matric (Grade 12)</h3>
                    <p class="timeline-subtitle">Hoerskool Akasia</p>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact">
            <h2>Contact Me</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div>
                        <h3>Email</h3>
                        <p>toni.maluleka.tm@gmail.com</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div>
                        <h3>Phone</h3>
                        <p>+27 68 047 8156</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <h3>Location</h3>
                        <p>8 Ravensmead, Cape Town, South Africa</p>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <footer>
        <div class="container">
            <p>&copy; 2024 Toni Maluleka. All rights reserved.</p>
            <p>Designed with <i class="fas fa-heart" style="color: var(--success);"></i> for your professional journey</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>