import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { columns, ConcorrenteInterface } from './Column'
import { DataTable } from './data-table'


export async function getServerSideProps() {
    const data = await getData()
    return { props: { data } }
}

async function getData(): Promise<ConcorrenteInterface[]> {
    const url = `${process.env.NEXT_PUBLIC_API_CBMERJ_URL} + /concorrentes}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'secret-id': process.env.NEXT_PUBLIC_API_SECRET_ID,
            'secret-key': process.env.NEXT_PUBLIC_API_SECRET_KEY,
        } as HeadersInit,
    })
    return response.json()
}

export default function Concorrentes({
    data,
}: {
    data: ConcorrenteInterface[]
}) {
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


