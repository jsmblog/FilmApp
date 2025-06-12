import React, { useState } from 'react';
import { IonIcon, IonCard, IonImg, IonAvatar } from '@ionic/react';
import { getTimeAgo } from '../js/getTimeAgo';
import { ellipsisVertical, person, send, pencil } from 'ionicons/icons';
import opinion from '/opinion.png';
import { connectionToBackend } from '../connection/connectionToBackend';
import { useToast } from '../hooks/UseToast';
import { formatDateTime } from '../js/formatDate';

interface BoxCommentsProps {
  allComments: any[];
  closeBoxComments: () => void;
  createComment: () => Promise<void>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  fetchComments: () => Promise<void>;
}

const BoxComments: React.FC<BoxCommentsProps> = ({
  allComments,
  closeBoxComments,
  createComment,
  comment,
  setComment,
  fetchComments
}) => {
  const [openOptionId, setOpenOptionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const { showToast, ToastComponent } = useToast();

  const stored = sessionStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const id_user = user?.id || '';

  const toggleOptions = (id: string) => {
    setOpenOptionId(prev => (prev === id ? null : id));
    setEditingId(null);
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await connectionToBackend.delete(`delete/comment/${id}`);
      showToast('Comentario eliminado correctamente', 2000);
      fetchComments();
    } catch (error) {
      console.error(error);
      showToast('Error al eliminar el comentario', 3000);
    }
  };

  const startEditing = (id: string, current: string) => {
    setEditingId(id);
    setEditText(current);
    setOpenOptionId(null);
  };

  const handleUpdateComment = async (id: string) => {
    if (!editText.trim()) {
      return showToast('El comentario no puede quedar vacío', 2000);
    }
    try {
      await connectionToBackend.put(`up/comment/${id}`, { comment: editText.trim() });
      showToast('Comentario actualizado', 2000);
      setEditingId(null);
      fetchComments();
    } catch (error) {
      console.error(error);
      showToast('Error al actualizar el comentario', 3000);
    }
  };

  return (
    <div className="box-comments">
      {ToastComponent}
      <IonCard className="ion-card-comments">
        <button className="btn-close-box-comments" onClick={closeBoxComments}>✕</button>
        <h2 className="total-comments">
          {allComments.length}
          {allComments.length === 1 ? ' comentario' : ' comentarios'}
        </h2>
        <section className="sect-comments">
          {allComments.length > 0 ? allComments.map(c => {
            const { comments, createdAt, id, users } = c;
            const photoSrc = `data:image/png;base64,${users.photoProfile}`;
            const isOpen = openOptionId === id.toString();
            const isEditing = editingId === id.toString();

            return (
              <div className="item-comment" key={id}>
                <div className="header-comment">
                  {users.photoProfile ? (
                    <IonAvatar><IonImg className='photo-profile-bg' src={users.photoProfile ? photoSrc : person} /></IonAvatar>
                  ) : (
                    <IonAvatar><IonImg className='photo-profile-bg' src={person} /></IonAvatar>
                  )}
                  <h5 className="name-user">{users.user}</h5>
                  <span className="time-ago">{!comments.state && 'hace: '}{getTimeAgo(createdAt)}</span>
                  {
                    comments.state && <span className="time-ago">(edit: {formatDateTime(comments.updatedAt)})</span>
                  }
                </div>

                {isEditing ? (
                  <div className="edit-area">
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                    <button onClick={() => handleUpdateComment(id)}>
                      <IonIcon icon={send} />
                    </button>
                    <button className='delete-comment' onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <p className="comment">{comments.comment}</p>
                )}

                {id_user === users.id && !isEditing && (
                  <div className="cont-three-points">
                    <button onClick={() => toggleOptions(id.toString())}>
                      <IonIcon icon={ellipsisVertical} />
                    </button>
                    {isOpen && (
                      <div className="box-options">
                        <button onClick={() => startEditing(id.toString(), comments.comment)}>
                        editar
                        </button>
                        <button
                          className="delete-comment"
                          onClick={() => handleDeleteComment(id)}
                        >
                          eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="empty-comments">
              <img width={300} src={opinion} alt="" />
              <h4>¡Sé el primero en comentar!</h4>
            </div>
          )}
        </section>
        <div className="cont-coment-media">
          <input
            type="text"
            name="comment"
            placeholder="Comenta esta película"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button onClick={createComment} className="send-comment">
            <IonIcon icon={send} />
          </button>
        </div>
      </IonCard>
    </div>
  );
};

export default BoxComments;
