import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import Image from "next/image";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Chart } from "@/components/Chart";
import Link from "next/link";
import FormattedDateTime from "@/components/FormattedDateTime";
import { Separator } from "@/components/ui/separator";
import Thumbnail from "@/components/Thumbnail";
import ActionDropdown from "@/components/ActionDropdown";
import { FileDocument, TotalSpaceUsed } from "@/types";

const Dashboard = async () => {
  const [filesResult, totalSpaceResult] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  const files = filesResult as { documents: FileDocument[]; total: number } | null;
  const totalSpace = totalSpaceResult as TotalSpaceUsed | undefined;

  if (!totalSpace) {
    return <p className="text-center mt-20">Could not load storage data.</p>;
  }

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container p-3 xs:p-4 sm:p-6 xl:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-5 xl:gap-6 2xl:gap-8 max-w-[1800px] mx-auto w-full">
      {/* Left Column: Storage Chart & Summary Cards */}
      <section className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 flex flex-col gap-5 xl:gap-6">
        <Chart used={totalSpace.used} />

        <div className="space-y-3">
          <h3 className="h4 text-dark-100 font-semibold px-1">Categories</h3>
          <ul className="dashboard-summary-list grid grid-cols-2 gap-3 xs:gap-4">
            {usageSummary.map((summary) => (
              <li key={summary.title} className="w-full">
                <Link
                  href={summary.url}
                  className="dashboard-summary-card bg-white rounded-2xl p-3.5 xs:p-4 sm:p-5 border border-light-200/40 shadow-sm hover:shadow-drop-3 transition-all duration-200 flex flex-col justify-between gap-3 sm:gap-4 relative overflow-hidden group h-full cursor-pointer hover:border-brand/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="size-10 xs:size-11 sm:size-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Image
                        src={summary.icon}
                        alt={summary.title}
                        width={24}
                        height={24}
                        className="size-5 sm:size-6"
                      />
                    </div>
                    <span className="text-xs xs:text-sm sm:text-base font-bold text-dark-100 truncate text-right">
                      {convertFileSize(summary.size) || "0 Bytes"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-dark-100 text-sm xs:text-base">
                      {summary.title}
                    </h4>
                    <Separator className="bg-light-200/30 my-1" />
                    <div className="flex items-center justify-between text-[10px] xs:text-[11px] sm:text-xs text-light-200 gap-1">
                      <span className="truncate">Updated</span>
                      <FormattedDateTime
                        date={String(summary.latestDate)}
                        className="truncate text-light-100 font-medium"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Right Column: Recent Files */}
      <section className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 flex flex-col bg-white rounded-2xl p-4 xs:p-5 sm:p-6 border border-light-200/40 shadow-sm h-full">
        <h3 className="h4 text-dark-100 font-semibold mb-4">Recent files uploaded</h3>
        {files && files.documents.length > 0 ? (
          <ul className="flex flex-col gap-2.5 sm:gap-3 w-full flex-1 overflow-y-auto remove-scrollbar max-h-[500px] lg:max-h-none">
            {files.documents.map((file: FileDocument) => (
              <li
                key={file.$id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-light-300 transition-colors border border-transparent hover:border-light-200/30 gap-3 group"
              >
                <Link
                  href={file.url}
                  target="_blank"
                  className="flex items-center gap-3 min-w-0 flex-1"
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    className="size-9 sm:size-10 min-w-9 sm:min-w-10 shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="recent-file-name text-xs xs:text-sm font-semibold text-dark-100 truncate group-hover:text-brand transition-colors">
                      {file.name}
                    </p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption text-[11px] text-light-200 truncate mt-0.5"
                    />
                  </div>
                </Link>
                <div className="shrink-0">
                  <ActionDropdown file={file} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <Image
              src="/assets/icons/file-document-light.svg"
              alt="Empty"
              width={48}
              height={48}
              className="size-12 opacity-30 mb-2"
            />
            <p className="empty-list text-light-200 text-sm">No files uploaded yet</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
