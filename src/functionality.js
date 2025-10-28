import { display } from "./display";
import { currentWeatherPage } from "./default";
import { weatherClassData } from ".";
import { callAPI } from "./async";

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
            input.disabled = true;
            window.style.display = "flex";
        });
    };

    const exitSearchWinBtn = (btn, window, input) => {
        btn.addEventListener("click", () => {
            input.disabled = false;
            input.enabled = true;
            window.style.display = "none";
        })
    };

    const locationDivBtn = (locationDiv, weatherDataObj, window, index) => {
        locationDiv.addEventListener("click", () => {
        display.fullPage(weatherDataObj);
        currentWeatherPage.currentPage = index;
        
        const circleSection = document.querySelector(".page-slider");
        display.circleSection(circleSection, weatherClassData.length, currentWeatherPage.currentPage);

        const circles = document.querySelectorAll(".page-slider>svg");
        const left = document.querySelector(".left");
        const right = document.querySelector(".right");

        functionality.switchPagesBtns(circles, left, right);
        
        window.close();
      });
    };

    const switchPagesBtns = (circles, left, right) => {
        const leftIcon = left.cloneNode(true);
        left.parentNode.replaceChild(leftIcon, left);

        leftIcon.addEventListener("click", () => {
          
          circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
          if(currentWeatherPage.currentPage == 0)
          {
            currentWeatherPage.currentPage = weatherClassData.length - 1;
          }
          else
          {
            currentWeatherPage.currentPage = currentWeatherPage.currentPage  - 1;
          }
          display.fullPage(weatherClassData[currentWeatherPage.currentPage]);
          circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
          
        });

        const rightIcon = right.cloneNode(true);
        right.parentNode.replaceChild(rightIcon, right);

        rightIcon.addEventListener("click", () => {
          
          circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
          
          if(currentWeatherPage.currentPage == weatherClassData.length - 1)
          {
            currentWeatherPage.currentPage = 0;
          }
          else
          {
            currentWeatherPage.currentPage = currentWeatherPage.currentPage  + 1;
          }
          
          display.fullPage(weatherClassData[currentWeatherPage.currentPage]);
          circles[currentWeatherPage.currentPage].classList.toggle("current-circle");
        });
    };

    const showEditPgs = (btn) => {
      btn.addEventListener("click", () => {
        const dropDown = document.querySelector(".edit-locations > svg");
        dropDown.style.display = "none"
        
        const exitBtn = document.querySelector(".exit-edit-btn");
        exitBtn.style.display = "block";
        functionality.exitEditPgs(exitBtn);
        
        const deleteBtns = document.querySelectorAll(".locations>div>svg");
        deleteBtns.forEach((deleteBtn) => {
          deleteBtn.style.display = "block";
          functionality.exitEditPgs(deleteBtn);
        });
      })
    };

    const exitEditPgs = (btn) => {
      btn.addEventListener("click", () => {
        console.log(btn);
        const dropDown = document.querySelector(".edit-locations > svg");
        dropDown.style.display = "block"
        
        const exitBtn = document.querySelector(".exit-edit-btn");
        exitBtn.style.display = "none";
        
        const deleteBtns = document.querySelectorAll(".locations>div>svg");
        deleteBtns.forEach((deleteBtn) => {
          deleteBtn.style.display = "none";
        });
      });
    }

    const searchForLocation = (input) => {
      const searchResults = document.querySelector(".search-results")
      input.addEventListener("input", () => {
        let id = setTimeout(() => {
          callAPI.searchResult(input.value).then((result) => {
            if(result != null)
            {
              display.searchResult(searchResults,result);
            }
            else
            {
              display.invalidSearchResult(searchResults,input.value);
            }
            
          })
        }, "1000");

        input.addEventListener("input", () => {
          clearTimeout(id);
        });
        
      });
    }

    return {slider, dropDown, dropDownBtn, showWinBtn, showSearchWin, exitSearchWinBtn, locationDivBtn, switchPagesBtns, showEditPgs, exitEditPgs, searchForLocation};
})();