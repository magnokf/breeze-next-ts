import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import DeleteUserForm from './partials/DeleteUserForm'
import UpdateProfileInformationForm from './partials/UpdateProfileInformationForm'

const Profile = () => {
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
                            <UpdateProfileInformationForm />
                        </div>
                    </div>

                    {/* <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                           <UpdatePasswordForm />
                        </div>
                    </div> */}

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Profile
