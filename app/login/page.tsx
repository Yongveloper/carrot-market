import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '@/components/social-login';

export default function Login() {
  const handleForm = async (formData: FormData) => {
    'use server';
    console.log(formData.get('email'), formData.get('password'));
    console.log('i run in the server baby!');
  };

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
        <FormInput
          name="email"
          required={true}
          type="email"
          placeholder="Email"
          errors={[]}
        />
        <FormInput
          name="password"
          required={true}
          type="password"
          placeholder="Password"
          errors={[]}
        />
        <FormButton loading={false} text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
}
