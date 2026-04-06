package servicehub.system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import servicehub.system.Entity.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationId(Long conversationId);
    List<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId);

    @Query("""
        SELECT m FROM Message m
        WHERE m.conversation.id = :conversationId 
        ORDER BY m.createdAt DESC 
        LIMIT :limit
    """)
    List<Message> findRecentMessages(@Param("conversationId") Long conversationId,
                                     @Param("limit") int limit);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :conversationId AND m.isRead = false")
    long countUnreadMessages(@Param("conversationId") Long conversationId);
}
