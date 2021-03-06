import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
import { courseStore, connectWithRedux, setup } from './controllers';
import { Students, Staffs, CourseInfo, RemoveCourse } from './components';

class CourseSettingsWithRedux extends Component {
  constructor(props) {
    super(props);
    this.offeringId = this.props.match.params.id;

    setup.init(props);
  }

  componentDidMount() {
    setup.setupCourseSettingsPage(this.offeringId);
  }

  render() {
    const { offering } = this.props;
    const loading = !offering;

    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Course Settings',
        icon: 'settings',
        sticky: true,
        gradient: true,
        offsetTop: 30
      },
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      },
      metaTagsProps: {
        title: 'Course Settings'
      }
    }));

    if (!loading && offering.fullNumber) {
      layoutProps.headingProps.heading = <><span>{offering.fullNumber}</span> Settings</>;
      layoutProps.metaTagsProps.title = `Settings | ${offering.fullNumber}`;
    }

    return (
      <CTLayout {...layoutProps}>
        <CTFragment loading={loading} padding={[0, 30]}>
          <CourseInfo />
          {(offering && offering.accessType === 2) && <Students />}
          <Staffs />
          <RemoveCourse />
        </CTFragment>
      </CTLayout>
    );
  }
}

export const CourseSettings = withReduxProvider(
  CourseSettingsWithRedux,
  courseStore,
  connectWithRedux,
  ['offering'],
  ['all']
);
