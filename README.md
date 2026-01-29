# Shri Amarnath JanShakti Sewa Mandal - Website Documentation

## Overview
This is a fully responsive, modern website for Shri Amarnath JanShakti Sewa Mandal (SAJSSM), a registered charitable organization dedicated to serving pilgrims with free langar services during the sacred Amarnath Yatra.

---

## Website Structure

### Pages Included

#### 1. **index.html** - Home Page
- Hero section with attractive graphics
- Features showcase (Free Langar, Medical Support, Safety & Guidance, Community Service)
- Call-to-action sections
- Social media links
- Responsive design

#### 2. **about.html** - About Us
- Organization mission and vision
- Core values (Spirituality, Compassion, Community, Growth)
- Organization details and registration info
- Team roles and responsibilities
- Call-to-action buttons

#### 3. **history.html** - Our History
- Timeline of organization's journey
- Achievements and milestones
- Future vision and plans
- Key accomplishments

#### 4. **Yatra.html** - Amarnath Yatra Information (Complete Guide)
- Quick action buttons:
  - Register for Yatra
  - List of Doctors
  - Designated Banks
  - Download Medical Form
  - Download Registration Form

- About Amarnath Yatra section
- History of the pilgrimage
- How to reach (by air, train, road)
- Spiritual significance
- Role of Langars in Yatra
- Yatra tips and best practices
- Comprehensive dos & don'ts list

#### 5. **Donation.html** - Support Our Mission
- Donation impact calculator
- Multiple donation methods:
  - Online bank transfers
  - Mobile payments (Google Pay, PhonePe, Paytm)
  - Cheque donations
  - Direct donations
- Tax benefits information
- Financial transparency details
- Donation form with validation
- Thank you message

#### 6. **News.html** - News & Events
- Latest news updates
- Event calendar
- Newsletter subscription
- Updates about langar services

#### 7. **Gallery.html** - Photo Gallery
- Image showcase
- Hover effects
- Photo descriptions

#### 8. **Contact_Us.html** - Contact & Location
- Contact information cards
- Contact form with validation
- Google Maps integration
- Working hours
- Multiple contact methods

---

## Features

### Design Features
✨ **Colorful & Vibrant Design**
- Primary Colors: Orange (#ff6b35) & Navy Blue (#004e89)
- Secondary Color: Gold (#f7931e)
- Accent Colors for emphasis and hierarchy

🎨 **Animations & Transitions**
- Smooth fade-in animations for elements
- Hover effects on cards and buttons
- Scroll-triggered animations
- Button ripple effects
- Page transition animations

📱 **Fully Responsive Design**
- Mobile-first approach
- Breakpoints for all device sizes
- Flexible grid layouts
- Mobile menu toggle
- Touch-friendly buttons

### Interactive Elements
- Smooth navigation menu with active states
- Form validation and submission
- Scroll animations
- Hover effects and transitions
- Mobile menu hamburger toggle
- Social media icon links
- Ripple effect on buttons

---

## File Structure

```
SAJSSM/
├── index.html              # Home page
├── about.html              # About us page
├── history.html            # Organization history
├── Yatra.html              # Complete yatra guide
├── Donation.html           # Donations page
├── News.html               # News & events
├── Gallery.html            # Photo gallery
├── Contact_Us.html         # Contact information
├── Style.css               # Comprehensive stylesheet
├── script.js               # JavaScript functionality
└── Images/
    ├── logo.png.png        # Organization logo
    ├── langar1.jpg         # Langar service photos
    ├── Yatra2.jpg          # Yatra photos
    └── qr.png.jpg          # QR code (if needed)
```

---

## CSS Features

### Color Scheme
```css
--primary-color: #ff6b35        (Orange)
--secondary-color: #f7931e      (Gold)
--accent-color: #004e89         (Navy Blue)
--success-color: #06a77d        (Green)
--danger-color: #d62828         (Red)
--light-bg: #f8f9fa             (Light Gray)
--dark-text: #1a1a1a            (Dark)
```

### Component Styles
- Header with gradient background
- Sticky navigation bar
- Feature cards with hover effects
- Button styles (primary, secondary, large)
- Form inputs with focus states
- Timeline animations
- Grid layouts
- Box shadows and border-radius

---

## JavaScript Features

### Functionality
1. **Navigation**
   - Mobile menu toggle
   - Active link highlighting
   - Auto-close menu on scroll

2. **Forms**
   - Contact form submission
   - Donation form handling
   - Newsletter subscription
   - Form validation

3. **Animations**
   - Scroll-triggered animations
   - Intersection Observer for performance
   - Lazy loading of images
   - Ripple effect on buttons

4. **Utilities**
   - Year auto-update in footer
   - Smooth scroll to anchors
   - Notification system
   - Keyboard navigation

---

## Customization Guide

### Adding New Content

#### To Update Organization Details:
1. Edit header information in all HTML files
2. Update phone numbers and addresses
3. Modify registration details

#### To Add Social Media Links:
1. Open any HTML file
2. Find the `.social-links` section
3. Replace `#` with actual social media URLs

#### To Modify Colors:
1. Edit `:root` variables in `Style.css`
2. Update all color references throughout the site

#### To Add New Pages:
1. Copy an existing page HTML file
2. Update the content
3. Add link to navigation menu in all pages

---

## SEO & Accessibility

✅ **Accessibility Features**
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Alt text for images
- High contrast colors
- Focus states for interactive elements

✅ **SEO Optimization**
- Descriptive page titles
- Meta descriptions
- Proper heading hierarchy
- Mobile-responsive design
- Fast load times
- Image optimization

---

## Browser Compatibility
- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Optimizations
- Lazy loading of images
- Minified CSS (can be further optimized)
- Efficient JavaScript with event delegation
- CSS animations using transform and opacity
- Intersection Observer for animations
- Viewport-based rendering

---

## How to Deploy

### Steps to Upload Website:
1. All files are ready for deployment
2. Upload to web hosting via FTP/SFTP
3. Ensure proper file permissions
4. Update social media links and contact methods
5. Test all forms and links before going live

### Required Setup:
- Web hosting with PHP support (optional, for form handling)
- SSL certificate (recommended for security)
- Domain name pointed to hosting

---

## Contact & Support Information

**Organization Details:**
- Name: Shri Amarnath JanShakti Sewa Mandal
- Registration: REG.01104
- Address: H.No. 86/5, Gandhi Nagar, Karnal, Haryana 132001
- Phones: 9466132732, 9466132733, 7015345275, 9996181668

---

## Future Enhancements

Potential additions:
1. Blog section for pilgrim stories
2. Live tracking of langar services
3. Online payment gateway integration
4. Testimonials section
5. Multi-language support
6. Admin dashboard
7. Event registration system
8. Volunteer application portal

---

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (Vanilla)** - Interactive functionality
- **Font Awesome Icons** - Beautiful icons
- **Google Fonts** - Custom typography
- **Google Maps API** - Location embedding

---

## Notes

- All forms currently show success messages but don't send emails (backend integration needed)
- Social media links are placeholders (update with actual URLs)
- Bank details and payment information need to be filled in
- Images should be optimized for web
- Consider adding a terms & conditions page

---

## Support & Maintenance

For any updates or changes:
1. Update HTML content directly
2. Modify CSS in Style.css for styling changes
3. Add new functionality in script.js
4. Test all changes across devices before deployment

---

**Last Updated:** January 28, 2026
**Version:** 1.0
**Status:** Ready for Deployment ✅
