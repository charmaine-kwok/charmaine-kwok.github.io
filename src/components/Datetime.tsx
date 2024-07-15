import { LOCALE } from "@config";

interface DatetimesProps {
  datetime: string | Date;
  svgIcon: JSX.Element; // Accepts an SVG element
}

interface Props {
  pubDatetime: string | Date;
  modDatetime?: string | Date | null;
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime = null,
  size = "sm",
  className,
}: Props) {
  const modIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${size === "sm" ? "scale-90" : "scale-100"} inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
      aria-hidden="true"
    >
      <path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path>
      <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path>
    </svg>
  );

  const pubIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${size === "sm" ? "scale-90" : "scale-100"} inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
      aria-hidden="true"
    >
      <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
      <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
    </svg>
  );

  return (
    <div className={`flex items-center space-x-10 opacity-80 ${className}`}>
      {modDatetime && (
        <FormattedDatetime datetime={modDatetime} svgIcon={modIcon} />
      )}
      <FormattedDatetime datetime={pubDatetime} svgIcon={pubIcon} />
    </div>
  );
}

const FormattedDatetime = ({
  datetime,
  svgIcon,
}: DatetimesProps & { svgIcon: JSX.Element }) => {
  const dateObj = new Date(datetime);
  const formattedDate = dateObj.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center space-x-1">
      {svgIcon}
      <time dateTime={dateObj.toISOString()}>{formattedDate}</time>
    </div>
  );
};
