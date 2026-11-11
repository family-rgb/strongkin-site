(()=>{if(!('IntersectionObserver'in window))return document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>o.observe(e))})();
(()=>{const CLEAR=98;function measure(){document.querySelectorAll(".pg-clip").forEach(clip=>{const inner=clip.querySelector(".pg");if(!inner)return;const pad=parseFloat(getComputedStyle(inner).paddingBottom)||0;const contentEnd=inner.scrollHeight-pad;const target=clip.clientHeight-CLEAR;const sk=Math.max(0,Math.round(contentEnd-target));inner.style.setProperty("--sk","-"+sk+"px")})}function init(){measure();window.addEventListener("load",measure);window.addEventListener("resize",measure);document.querySelectorAll(".pg-clip img").forEach(img=>img.addEventListener("load",measure))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init()})();
(()=>{
  const ENDPOINT='https://kfldepdiedsbhuvicsjv.supabase.co'+"/rest/v1/waitlist_signups";
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbGRlcGRpZWRzYmh1dmljc2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1OTU1ODksImV4cCI6MjA5MzE3MTU4OX0.96vENPUlUpr-VynZx9hBO-qA91qDgMOrPAlqXAI1f74';
  const EMAIL=/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  const opened=Date.now();
  function setStatus(form,msg,ok){
    const status=form.querySelector(".waitlist-status");
    if(!status)return;
    status.textContent=msg;
    form.classList.toggle("is-ok",!!ok);
  }
  document.querySelectorAll("form.waitlist").forEach(form=>{
    form.addEventListener("submit",async ev=>{
      ev.preventDefault();
      const email=(form.email.value||"").trim();
      const honeypot=(form.company&&form.company.value||"").trim();
      const btn=form.querySelector('button[type="submit"]');
      if(!EMAIL.test(email)){
        setStatus(form,"Please enter a valid email address.",false);
        form.email.focus();
        return;
      }
      // Honeypot or instant submit: pretend success, do not write.
      if(honeypot || Date.now()-opened<1500){
        setStatus(form,"You’re on the list. We’ll write when your family can join.",true);
        return;
      }
      if(btn)btn.disabled=true;
      setStatus(form,"Saving…",false);
      try{
        const res=await fetch(ENDPOINT,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "apikey":ANON,
            "Authorization":"Bearer "+ANON,
            "Prefer":"return=minimal"
          },
          body:JSON.stringify({email:email.toLowerCase(),source:form.dataset.source||"homepage"})
        });
        if(res.ok || res.status===409){
          setStatus(form,"You’re on the list. We’ll write when your family can join.",true);
        }else{
          setStatus(form,"Something went wrong. You can also email family@strongkin.net.",false);
          if(btn)btn.disabled=false;
        }
      }catch(err){
        setStatus(form,"Something went wrong. You can also email family@strongkin.net.",false);
        if(btn)btn.disabled=false;
      }
    });
  });
})();
