import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { columns, Payment } from './Column'
import { DataTable } from './data-table'

export default function Concorrentes({ data }: { data: Payment[] }) {
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Perfil
                </h2>
            }>
            <Head>
                <title>ProgPlan - Perfil</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <div className="container mx-auto py-10">
                                <DataTable columns={columns} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export async function getServerSideProps() {
    const data = await getData()
    return { props: { data } }
}

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: '728ed52f',
            amount: 100,
            status: 'pending',
            email: 'm@example.com',
        },
        // Add more data items as needed...
    ]
}
