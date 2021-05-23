// as per https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {
    faUserAstronaut,
    faArrowCircleRight,
    faBabyCarriage,
    faBug,
} from '@fortawesome/free-solid-svg-icons'
import {
    faTelegram,
    faTwitter,
    faFacebook,
} from '@fortawesome/free-brands-svg-icons'
import {
    faAddressBook,
    faCalendar,
    faBell
} from '@fortawesome/free-regular-svg-icons'

library.add(
    faUserAstronaut,
    faArrowCircleRight,
    faBabyCarriage,
    faBug,
    faTelegram,
    faTwitter,
    faFacebook,
    faAddressBook,
    faCalendar,
    faBell
);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch()
