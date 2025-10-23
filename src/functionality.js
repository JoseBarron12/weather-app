export const functionality = (function() {
    const slider = (slider) => {
        let mouseDown = false;
        let startX, scrollLeft;

        const startDragging = (e) => {
        mouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        }

        const stopDragging = (e) => {
        mouseDown = false;
        }

        const move = (e) => {
        e.preventDefault();
        if(!mouseDown) { return; }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
        }

        slider.addEventListener('mousemove', move, false);
        slider.addEventListener('mousedown', startDragging, false);
        slider.addEventListener('mouseup', stopDragging, false);
        slider.addEventListener('mouseleave', stopDragging, false);

    };

    const dropDown = (parent, height) => {
        const isOpen = parent.classList.toggle("isOpen");
        
        const dropDownMenu = parent.nextElementSibling;
        dropDownMenu.style.top = `${height}px`;
        dropDownMenu.style.right = `16px`;

        const closeMenu = () => {
        dropDownMenu.style.display = "none";
        parent.classList.remove("isOpen");
        }

        if(isOpen) {
            dropDownMenu.style.display = "block";
            dropDownMenu.addEventListener("click", closeMenu);
            dropDownMenu.addEventListener("mouseleave", closeMenu);
        }
        else {
            dropDownMenu.style.display = "none";
            dropDownMenu.removeEventListener("click", closeMenu);
            dropDownMenu.removeEventListener("mouseleave", closeMenu);
        }
    };

    const dropDownBtn = (btn) => {
        btn.addEventListener("click", () => {
        const rect = btn.getBoundingClientRect();   
        functionality.dropDown(btn, rect.width + 8 + rect.top);
        });

        btn.addEventListener("mouseenter", () => {
        const rect = btn.getBoundingClientRect();  
        functionality.dropDown(btn, rect.width + 8 + rect.top);
        });
    };

    const showWinBtn = (btn, window) => {
        btn.addEventListener("click", () => {
            window.show();
        });
    };

    const showSearchWin = (input, window) => {
        input.addEventListener("focus", () => {
          window.style.display = "flex";
        });
    };

    const exitSearchWinBtn = (btn, window) => {
        btn.addEventListener("click", () => {
          window.style.display = "none";
        })
    };

    return {slider, dropDown, dropDownBtn, showWinBtn, showSearchWin, exitSearchWinBtn};
})();