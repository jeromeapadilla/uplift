const header=document.querySelector('#header');
const menuButton=document.querySelector('.menu-button');
const navigation=document.querySelector('#primary-nav');
const closeMenu=()=>{menuButton?.setAttribute('aria-expanded','false');navigation?.classList.remove('open')};
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));navigation.classList.toggle('open',!open)});
navigation?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',window.scrollY>20),{passive:true});
const items=document.querySelectorAll('.reveal');
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window)){items.forEach(item=>item.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});items.forEach(item=>observer.observe(item))}
document.querySelectorAll('.package-link').forEach(link=>link.addEventListener('click',()=>{const select=document.querySelector('#package');if(select)select.value=link.dataset.package||''}));
document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false})}));
const form=document.querySelector('#project-form');
form?.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const name=document.querySelector('#name').value.trim();const email=document.querySelector('#email').value.trim();const pack=document.querySelector('#package').value;const message=document.querySelector('#message').value.trim();const subject=encodeURIComponent(`Uplift project request — ${pack}`);const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPackage: ${pack}\n\nProject details:\n${message||'I would like to discuss my new website.'}`);document.querySelector('#form-status').textContent='Opening your email app with the project details ready to send…';window.location.href=`mailto:upliftwebplan@gmail.com?subject=${subject}&body=${body}`});
