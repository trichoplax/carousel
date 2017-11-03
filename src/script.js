var startTime   // in milliseconds since epoch
var preferredAnimationDuration = 1000    // in milliseconds
var targetPosition = 0  // integer indicating which image (zero indexed)
var currentPosition = 0 // float on same scale as targetPosition
var currentVelocity = 0 // in image widths per frame
var maxAcceleration = 100 // in image widths per frame per frame
var timeoutId = 0

document.addEventListener('DOMContentLoaded', tasksOnLoad)

function tasksOnLoad() {
    document.getElementById('js_left-arrow-button').addEventListener('click', scrollRight)
    document.getElementById('js_right-arrow-button').addEventListener('click', scrollLeft)
    document.querySelector('.thumbnail.image-0').addEventListener('click', function(){scrollTo(0)})
    document.querySelector('.thumbnail.image-1').addEventListener('click', function(){scrollTo(1)})
    document.querySelector('.thumbnail.image-2').addEventListener('click', function(){scrollTo(2)})
    document.querySelector('.thumbnail.image-3').addEventListener('click', function(){scrollTo(3)})
}

function scrollLeft() {
    startTime = Date.now()
    targetPosition += 1
    clearTimeout(timeoutId)
    animate()
}

function scrollRight() {
    startTime = Date.now()
    targetPosition -= 1
    clearTimeout(timeoutId)
    animate()
}

function scrollTo(position) {
    if (targetPosition !== position) {
        startTime = Date.now()
        targetPosition = position
        clearTimeout(timeoutId)
        animate()
    }
}

function reposition() {
    var carouselImages = document.querySelectorAll('.carousel-image')
    for (var i = 0; i < carouselImages.length; i++) {
        carouselImages[i].style.display = 'none'
    }
    for (var i = -1; i <= 4; i++) {
        var offsetPosition = i - currentPosition
        if (offsetPosition > -1 && offsetPosition < 1) {
            showImage(i, offsetPosition)
        }
    }
}

function showImage(index, offset) {
    index += 4
    index %= 4
    var selector = '.carousel-image.image-' + index
    var carouselImage = document.querySelector(selector)
    carouselImage.style.display = 'block'
    var vw = window.innerWidth / 100
    var vh = window.innerHeight / 100
    var currentWidth = Math.min(80 * vw, 113.7777777777777 * vh)
    carouselImage.style.left = (offset * currentWidth) + 'px'
}

function animate() {
    var displacement = targetPosition - currentPosition
    var elapsedTime = Date.now() - startTime
    var preferredRemainingTime = preferredAnimationDuration - elapsedTime
    var preferredRemainingFrames = Math.max(preferredRemainingTime / 16, 1)
    var idealVelocity = displacement / preferredRemainingFrames * (preferredRemainingTime * 3 + preferredAnimationDuration) / preferredAnimationDuration
    idealVelocitySize = Math.min(Math.abs(idealVelocity), Math.abs(displacement))
    idealVelocity = idealVelocitySize * Math.sign(idealVelocity)
    var acceleration = (idealVelocity - currentVelocity)
    if (Math.sign(acceleration) === Math.sign(currentVelocity)) {
        accelerationSize = Math.min(maxAcceleration, Math.abs(acceleration))
        acceleration = Math.sign(acceleration) * accelerationSize
    }
    currentVelocity += acceleration
    currentPosition += currentVelocity

    if (targetPosition < 0 && currentPosition < 0) {
        targetPosition += 4
        currentPosition += 4
    } else if (targetPosition > 3 && currentPosition > 3) {
        targetPosition -= 4
        currentPosition -= 4
    }

    reposition()

    if (!finishedAnimating()) {
        timeoutId = setTimeout(animate, 16)
    } else {
        currentPosition = targetPosition
        currentVelocity = 0
        reposition()
    }
}

function finishedAnimating() {
    if (Math.abs(currentPosition - targetPosition) < 0.001 && Math.abs(currentVelocity) < 0.001) {
        return true
    }
    return false
}

/**
 * Polyfill thanks to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
 */
if (!Math.sign) {
    Math.sign = function(x) {
        // If x is NaN, the result is NaN.
        // If x is -0, the result is -0.
        // If x is +0, the result is +0.
        // If x is negative and not -0, the result is -1.
        // If x is positive and not +0, the result is +1.
        return ((x > 0) - (x < 0)) || +x;
        // A more aesthetical persuado-representation is shown below
        //
        // ( (x > 0) ? 0 : 1 )  // if x is negative then negative one
        //          +           // else (because you cant be both - and +)
        // ( (x < 0) ? 0 : -1 ) // if x is positive then positive one
        //         ||           // if x is 0, -0, or NaN, or not a number,
        //         +x           // Then the result will be x, (or) if x is
        //                      // not a number, then x converts to number
    };
}