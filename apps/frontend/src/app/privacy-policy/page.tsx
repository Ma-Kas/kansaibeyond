import type { Metadata } from 'next';
import { dictionary } from '@/config/dictionary';

import classes from './PrivacyPolicy.module.css';

export const metadata: Metadata = {
  title: dictionary.privacyPolicy.title,
  description: dictionary.privacyPolicy.description,
  twitter: {
    site: './',
    card: 'summary_large_image',
    title: dictionary.privacyPolicy.title,
    description: dictionary.privacyPolicy.description,
    creator: '@kansaibeyond',
  },
  openGraph: {
    url: './',
    type: 'website',
    title: dictionary.privacyPolicy.title,
    description: dictionary.privacyPolicy.description,
  },
};

const PrivacyPolicyPage = () => {
  return (
    <section className={classes.section}>
      <article className={classes['privacy_policy_content']}>
        <h1>Privacy Policy</h1>
        <h2>What Type Of Information Do We Collect?</h2>
        <p>
          We collect personal information that you provide to us. Some
          information — such as your Internet Protocol (IP) address and/or
          browser and device characteristics — is collected automatically when
          you visit our website.
        </p>
        <p>
          When visitors leave comments on the site we collect the data shown in
          the comments form, and also the visitor&apos;s IP address and browser
          to help prevent spam.
        </p>
        <h2>Why Do We Collect This Information?</h2>
        <p>
          We use Google Analytics to record information about the pages a user
          has seen, for example the URL of the page, time of day, device used,
          etc. The information that we collect is anonymized and sent to Google
          Analytics. Google Analytics mainly uses first-party cookies to report
          on visitor interactions on this website.
        </p>
        <p>
          Users may disable cookies or delete any individual cookie from your
          browser settings tab.
        </p>
        <p>
          In addition, Google Analytics supports an optional browser add-on
          that, once installed and enabled, disables measurement by Google
          Analytics for any site a user visits. Note that this add-on only
          disables Google Analytics measurement.
        </p>
        <p>
          Google Analytics also collects Internet Protocol (IP) addresses to
          provide and protect the security of the service, and to give website
          owners a sense of which country, state, or city in the world their
          users come from (also known as “IP geolocation”). See&nbsp;
          <a
            title='https://support.google.com/analytics/answer/6004245'
            href='https://support.google.com/analytics/answer/6004245'
          >
            this page
          </a>
          &nbsp;for Google Analytics security and usage of data.
        </p>
        <p>
          We may use cookies and similar tracking technologies (like web beacons
          and pixels) to access or store information.
        </p>
        <p>
          This site uses Google Adsense for the purposes of placing advertising
          on the site, and they will collect and use certain data for
          advertising purposes. To learn more about Google Adsense data usage,
          click&nbsp;
          <a
            title='https://policies.google.com/privacy?hl=en'
            href='https://policies.google.com/privacy?hl=en'
          >
            here.
          </a>
        </p>
        <h2>Embedded Content</h2>
        <p>
          Articles on this site may include embedded content (e.g. YouTube,
          Twitter/X, Instagram, Ads etc.). Embedded content from other websites
          behaves in the exact same way as if the visitor had visited the other
          website. These websites may collect data about you, use cookies, embed
          additional third-party tracking, and monitor your interaction with
          that embedded content, including tracing your interaction with the
          embedded content if you have an account and are logged into that
          website. To learn how to control that information and request
          deletion, visit the Privacy Policy of the original website.
        </p>
        <h2>Who We Share Data With</h2>
        <p>
          The data collected may be shared with service providers and others who
          help with our business operations and assist in the delivery of our
          products and services including, but not limited to:
        </p>
        <ul>
          <li>Application development</li>
          <li>Site hosting</li>
          <li>Maintenance</li>
          <li>Data Analysis</li>
          <li>IT services</li>
          <li>Email delivery services</li>
          <li>Marketing</li>
          <li>Analytics</li>
          <li>
            Enforcement of our Terms of Service Agreement and other agreements
          </li>
          <li>Other users of the site if you choose to leave comments</li>
          <li>
            Third parties in order to prevent damage to our property (tangible
            and intangible), for safety reasons
          </li>
        </ul>
        <p>We do this to:</p>
        <ul>
          <li>Comply with legal processes</li>
          <li>
            Respond to requests from public and government authorities,
            including public and government authorities outside your country of
            residence
          </li>
          <li>Enforce our Terms of Service Agreement and other agreements</li>
          <li>Protect our operations</li>
          <li>
            Protect our rights, privacy, safety or property, and/or that of our
            affiliates, you, or others
          </li>
          <li>
            Allow us to pursue available remedies or limit the damages that we
            may sustain
          </li>
          <li>
            Third parties as we believe necessary or appropriate, in any manner
            permitted under applicable law, including laws outside your country
            of residence
          </li>
        </ul>
        <p>
          <strong>
            We will never sell, rent, or lease your Personal Data to a third
            party
          </strong>
        </p>
        <h2>How Long We Retain Your Data</h2>
        <p>
          If you leave a comment, the comment and its metadata are retained
          indefinitely, and will become part of the content of the site. This is
          so we can recognize and approve any follow-up comments automatically
          instead of holding them in a moderation queue.
        </p>
        <p>
          For users that register on our website (if any), we also store the
          personal information they provide in their user profile. All users can
          see, edit, or delete their personal information at any time. Website
          administrators can also see and edit that information.
        </p>
        <p>Analytics data is retained indefinitely.</p>
        <p>
          For all other services, we will retain your Personal Data for the
          period necessary to fulfill the purposes outlined in this Privacy
          Policy unless a longer retention period is required or allowed by law.
        </p>
        <h2>How Can You Contact Us Or Withdraw Consent?</h2>
        <p>
          Please contact us by email, or on one of the linked social media
          platforms.
        </p>
      </article>
    </section>
  );
};

export default PrivacyPolicyPage;
