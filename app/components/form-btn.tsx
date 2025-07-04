interface IFormButtonProps {
  loading: boolean;
  text: string;
}

export default function FormButton({ loading, text }: IFormButtonProps) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300"
    >
      {loading ? '로딩 중...' : text}
    </button>
  );
}
