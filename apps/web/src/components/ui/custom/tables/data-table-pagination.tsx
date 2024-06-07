'use client';

import { Separator } from '../../separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useSearchParams from '@/hooks/useSearchParams';
import { cn } from '@/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import useTranslation from 'next-translate/useTranslation';

interface DataTablePaginationProps<TData> {
  table?: Table<TData>;
  count?: number;
  className?: string;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;
  additionalSizes?: number[];
}

export function DataTablePagination<TData>({
  table,
  count,
  className,
  pageIndex,
  pageCount,
  pageSize,
  additionalSizes,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();

  // filter duplicate and sort sizes
  const sizes = [
    5,
    10,
    20,
    50,
    100,
    200,
    500,
    1000,
    pageSize ?? 10,
    ...(additionalSizes ?? []),
  ]
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a - b);

  const isPageOutOfRange = table
    ? table.getState().pagination.pageIndex + 1 > table.getPageCount()
    : pageIndex !== undefined
      ? pageIndex + 1 > (pageCount ?? 1)
      : false;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-1 px-2 text-center md:flex-row',
        className
      )}
    >
      {count !== undefined && count > 0 ? (
        <div className="text-muted-foreground flex-none text-sm">
          {/* {lang === 'vi' || lang === 'vi-VN' ? t('selected') : null}{' '} */}
          {/* <span className="text-primary font-semibold">
            {table ? table.getFilteredSelectedRowModel().rows.length : 0}
          </span>{' '}
          {t('of')}{' '} */}
          {/* {table.getFilteredRowModel().rows.length} row(s) selected. */}
          <span className="text-primary font-semibold">{count}</span>{' '}
          {t('result(s)')}
          {/* {lang !== 'vi' && lang !== 'vi-VN'
            ? ' ' + t('selected').toLowerCase()
            : null} */}
          .
        </div>
      ) : (
        <div />
      )}

      <Separator className="my-1 md:hidden" />

      <div className="flex flex-wrap items-center justify-center gap-2 text-center md:gap-4 lg:gap-8">
        <div className="hidden items-center space-x-2 md:flex">
          <p className="text-sm font-medium">{t('rows-per-page')}</p>
          <Select
            value={`${pageSize ?? table?.getState().pagination.pageSize ?? 0}`}
            onValueChange={(value) => {
              if (table) {
                table.setPageIndex(0);
                table.setPageSize(Number(value));
              }

              searchParams.set({ page: 1, pageSize: value });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={
                  pageSize ?? table?.getState().pagination.pageSize ?? 0
                }
              />
            </SelectTrigger>
            <SelectContent side="top">
              {sizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground w-fit text-sm">
          {t('page')}{' '}
          <span className="text-primary font-semibold">
            {isPageOutOfRange
              ? 1
              : (pageIndex ?? table?.getState().pagination.pageIndex ?? 0) + 1}
          </span>{' '}
          {t('of')}{' '}
          <span className="text-primary font-semibold">
            {pageCount ?? table?.getPageCount() ?? 1}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (table) {
                table.resetRowSelection();
                table.setPageIndex(0);
              }

              searchParams.set({ page: 1 });
            }}
            disabled={
              (pageIndex !== undefined
                ? pageIndex <= 0
                : table && !table.getCanPreviousPage()) || isPageOutOfRange
            }
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (table) {
                table.resetRowSelection();
                table.previousPage();
              }

              searchParams.set({
                page: pageIndex ?? table?.getState().pagination.pageIndex ?? 0,
              });
            }}
            disabled={
              (pageIndex !== undefined
                ? pageIndex <= 0
                : table && !table.getCanPreviousPage()) || isPageOutOfRange
            }
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (table) {
                table.resetRowSelection();
                table.nextPage();
              }

              searchParams.set({
                page: isPageOutOfRange
                  ? 2
                  : (pageIndex ?? table?.getState().pagination.pageIndex ?? 0) +
                    2,
              });
            }}
            disabled={
              (pageIndex !== undefined
                ? pageIndex >= (pageCount ?? 0) - 1
                : table && !table.getCanNextPage()) && !isPageOutOfRange
            }
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (table) {
                table.resetRowSelection();
                table.setPageIndex(table.getPageCount() - 1);
              }

              searchParams.set({
                page: pageCount ?? table?.getPageCount() ?? 1,
              });
            }}
            disabled={
              (pageIndex !== undefined
                ? pageIndex >= (pageCount ?? 0) - 1
                : table && !table.getCanNextPage()) && !isPageOutOfRange
            }
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
