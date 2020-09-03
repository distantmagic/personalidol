import { h } from "preact";

import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";

type Props = {
  loadingError: LoadingError;
};

// prettier-ignore
export function LoadingErrorScreen(props: Props) {
  return (
    <pi-fatal-error>
      <h1 slot="title">Error</h1>
      <p>
        Unexpected error occurred (yes, there are expected, foreseeable,
          recoverable errors). We are really, really sorry about that.
      </p>
      <p>
        We have automated bug reporting systems, so we most probably will be
        soon aware that this happened and take some appropriate actions to
        mitigate such things in the future.
        It still makes sense to send us this error if you need some personal
        support or want to provide some additional details about your setup.
        Our bug reporting systems do not store any kind of your personal data
        and are not linked in any way to your account, so we can't reach out to
        you even if we wanted to.
      </p>
      <p>
        In the meantime you can try some obvious things like reloading the
        page, checking internet connection, etc. Again, we are really, really,
        really sorry and deeply ashamed about this. If there is anything that
        can bring us peace, it is your forgiveness.
      </p>
      <pre slot="technical-description">
        <p>
          error while loading {props.loadingError.item.resourceType} {props.loadingError.item.resourceUri}
        </p>
        <p>{props.loadingError.item.id}</p>
        <p>{props.loadingError.error.message}</p>
        <p>{props.loadingError.error.stack}</p>
      </pre>
    </pi-fatal-error>
  );
}