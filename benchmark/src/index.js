// as per https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons'

// We are only using the user-astronaut icon
library.add(faUserAstronaut)

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch()
