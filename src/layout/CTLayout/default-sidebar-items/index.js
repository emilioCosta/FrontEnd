import { user, links, uurl, env } from 'utils';
import { createCTNavSidebarItemProps } from '../../CTNavSidebar/create-props';
import { getAdminNavItem } from './admin-items';
import { getComponentAPINavItem } from './component-api-items';


export class DefaultSidebarItems {
  constructor() {
    this.create = createCTNavSidebarItemProps;
  }

  get home() {
    return this.create({
      value: 'ct-nsb-home',
      text: 'Home',
      icon: 'home',
      href: links.home(),
      active: uurl.isEqual(links.home()),
      items: []
    });
  }

  get search() {
    return this.create({
      value: 'ct-nsb-search',
      text: 'Search',
      icon: 'search',
      href: links.search(),
      active: uurl.isEqual(links.search()),
      items: []
    });
  }

  get history() {
    return this.create({
      value: 'ct-nsb-history',
      text: 'History',
      icon: 'history',
      href: links.history(),
      active: uurl.isEqual(links.history()),
      items: []
    });
  }

  get analytics() {
    return this.create({
      value: 'ct-nsb-analytics',
      text: 'Analytics',
      icon: 'bar_chart',
      href: links.personalAnalytics(),
      active: uurl.isEqual(links.personalAnalytics()),
      items: []
    });
  }

  get admin() {
    return getAdminNavItem();
  }

  get myCourses() {
    return this.create({
      value: 'ct-nsb-inst',
      text: 'My Courses',
      icon: 'collections_bookmark',
      href: links.instructor(),
      active: uurl.isEqual(links.myCourses()) 
            || uurl.isEqual(links.newCourse()),
      items: [
        {
          value: 'ct-nsb-inst-courses',
          text: 'Courses',
          href: links.myCourses(),
          active: window.location.pathname === links.myCourses()
        },
        {
          value: 'ct-nsb-inst-new',
          text: 'New Course',
          href: links.newCourse(),
          active: window.location.pathname === links.newCourse()
        }
      ]
    });
  }

  get componentAPIs() {
    return getComponentAPINavItem();
  }

  get breakline() {
    return 'breakline';
  }

  get defaultItems() {
    let items = [this.home, this.search];

    if (user.isLoggedIn) {
      items.push(this.history);
      items.push(this.analytics);
    }

    const isInstructor = user.isInstructor;
    const isAdmin = user.isAdmin;

    if (isInstructor || isAdmin) {
      items.push('breakline');
    }

    if (isInstructor) {
      items.push(this.myCourses);
    }

    if (isAdmin) {
      items.push(this.admin);
    }

    if (env.dev) {
      items.push('breakline');
      items.push(this.componentAPIs);
    }

    return items;
  }

  getCoursePageSidebarItems(offering) {
    if (!offering || !offering.id) return this.defaultItems;
  
    const tabs = [
      {
        value: 'off-settings-tab',
        text: 'Settings',
        href: links.courseSettings(offering.id),
        active: uurl.isEqual(links.courseSettings(offering.id))
      },
      {
        value: 'off-new-pl-tab',
        text: 'New Playlist',
        href: links.instNewPlaylist(offering.id),
        active: uurl.isEqual(links.instNewPlaylist(offering.id))
      }
    ];
  
    if (offering.logEventsFlag) {
      tabs.unshift({
        value: 'off-analytics-tab',
        text: 'Analytics',
        href: links.courseAnalytics(offering.id),
        active: uurl.isEqual(links.courseAnalytics(offering.id))
      });
    }
  
    const offeringItem = {
      text: offering.fullNumber,
      active: true,
      icon: 'book',
      items: tabs,
      href: links.offeringDetail(offering.id)
    };
  
    return [
      ...this.defaultItems.slice(0, 6),
      offeringItem,
      ...this.defaultItems.slice(6)
    ];
  }
}

