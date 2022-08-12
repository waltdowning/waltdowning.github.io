class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
      <div class="header">
      <div class = "header-left">
        <a href="index.html"><div class="logo">
            Walt Downing
        </div></a>       
        </div>
        <div class="header-right">
        <!-- <ul>
            <li><a href="">games</a></li>
            <li><a href="">projects</a></li>
        </ul> -->
        <ul>
          <li><a href="https://github.com/waltdowning"><img src="img/GitHub-Mark-64px.png" class="socials"></a></li>
          <li><a href="https://www.linkedin.com/in/walt-downing/"><img src="img/LI-In-Bug.png" class="socials"></a></li>
        </ul>
         </div>         
     </div>
      `;
    }
  }
  
  customElements.define('header-component', Header);