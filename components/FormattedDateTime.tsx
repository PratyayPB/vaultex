import { formatDateTime } from "@/lib/utils";
import React from "react";
import { cn } from "@/lib/utils";

const FormattedDateTime = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => {
  return (
    <p className={cn("font-semibold text-light-100", className)}>
      {formatDateTime(date)}
    </p>
  );
};

export default FormattedDateTime;
