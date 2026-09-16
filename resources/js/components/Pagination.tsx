import { Link } from '@inertiajs/react'

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

interface Props {
  links: PaginationLink[]
  meta: PaginationMeta
}

const arrowClass =
  'relative inline-flex items-center px-2 py-2 font-jost text-gray-900 transition-colors duration-200 hover:bg-black hover:text-white focus:z-20 focus:outline-none'
const arrowDisabledClass =
  'relative inline-flex items-center px-2 py-2 font-jost text-gray-300 cursor-not-allowed'
const mobileLinkClass =
  'relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium font-jost text-gray-900 transition-colors duration-200 hover:bg-black hover:text-white'
const mobileDisabledClass =
  'relative inline-flex items-center border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium font-jost text-gray-400 cursor-not-allowed'

export default function Pagination({ links, meta }: Props) {
  if (!meta || !Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 font-jost sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {links[0].url ? (
          <Link
            href={links[0].url}
            className={mobileLinkClass}
          >
            Previous
          </Link>
        ) : (
          <span className={mobileDisabledClass}>
            Previous
          </span>
        )}
        {links[links.length - 1].url ? (
          <Link
            href={links[links.length - 1].url}
            className={`${mobileLinkClass} ml-3`}
          >
            Next
          </Link>
        ) : (
          <span className={`${mobileDisabledClass} ml-3`}>
            Next
          </span>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{meta.from}</span> to{' '}
            <span className="font-medium text-gray-900">{meta.to}</span> of{' '}
            <span className="font-medium text-gray-900">{meta.total}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px border border-gray-300" aria-label="Pagination">
            {links.map((link, index) => {
              if (index === 0) {
                return link.url ? (
                  <Link
                    key={index}
                    href={link.url}
                    className={arrowClass}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ) : (
                  <span
                    key={index}
                    className={arrowDisabledClass}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )
              }

              if (index === links.length - 1) {
                return link.url ? (
                  <Link
                    key={index}
                    href={link.url}
                    className={arrowClass}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                ) : (
                  <span
                    key={index}
                    className={arrowDisabledClass}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )
              }

              if (link.url === null) {
                return (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium font-jost text-gray-400"
                  >
                    {link.label}
                  </span>
                )
              }

              return (
                <Link
                  key={index}
                  href={link.url}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium font-jost transition-colors duration-200 focus:z-20 focus:outline-none ${
                    link.active
                      ? 'z-10 bg-black text-white hover:bg-gray-800 hover:text-white'
                      : 'text-gray-900 hover:bg-black hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </nav>
  )
}
